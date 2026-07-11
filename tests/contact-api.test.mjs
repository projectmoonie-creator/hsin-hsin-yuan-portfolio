import assert from "node:assert/strict";
import test from "node:test";

import contactHandler from "../api/contact.js";

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
    end(value = "") {
      this.body = value;
      return this;
    },
  };
}

async function callContact(body, env = {}) {
  const previousEnv = { ...process.env };
  Object.assign(process.env, env);
  for (const key of ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"]) {
    if (!(key in env)) delete process.env[key];
  }

  const req = { method: "POST", body };
  const res = createResponse();

  try {
    await contactHandler(req, res);
    return res;
  } finally {
    process.env = previousEnv;
  }
}

test("contact API rejects spam honeypot submissions before sending email", async () => {
  let fetchCalled = false;
  const originalFetch = global.fetch;
  global.fetch = async () => {
    fetchCalled = true;
    return { ok: true, json: async () => ({ id: "sent" }) };
  };

  try {
    const res = await callContact({
      name: "Bot",
      email: "bot@example.com",
      projectType: "Spam",
      message: "Hello",
      website: "https://spam.example",
      startedAt: String(Date.now() - 10_000),
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(fetchCalled, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("contact API requires mail environment configuration", async () => {
  const res = await callContact({
    name: "Real Person",
    email: "person@example.com",
    projectType: "Documentary",
    message: "I would like to discuss a project with enough detail.",
    startedAt: String(Date.now() - 10_000),
  });

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.ok, false);
  assert.match(res.body.error, /not configured/i);
});

test("contact API sends a structured email through Resend", async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ id: "email_123" }) };
  };

  try {
    const res = await callContact(
      {
        name: "Producer",
        email: "producer@example.com",
        projectType: "Cultural documentary",
        message: "We are looking for a director for a bilingual project.",
        link: "https://example.com/brief",
        startedAt: String(Date.now() - 10_000),
      },
      {
        RESEND_API_KEY: "test_key",
        CONTACT_TO_EMAIL: "inquiries@example.com",
        CONTACT_FROM_EMAIL: "Portfolio <portfolio@example.com>",
      },
    );

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal(calls[0].options.method, "POST");
    assert.equal(calls[0].options.headers.Authorization, "Bearer test_key");

    const payload = JSON.parse(calls[0].options.body);
    assert.equal(payload.to, "inquiries@example.com");
    assert.equal(payload.reply_to, "producer@example.com");
    assert.match(payload.subject, /Portfolio inquiry/);
    assert.match(payload.text, /Cultural documentary/);
    assert.doesNotMatch(payload.text, /website/);
  } finally {
    global.fetch = originalFetch;
  }
});
