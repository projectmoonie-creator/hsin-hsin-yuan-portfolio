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

async function callContact(body, env = {}, request = {}) {
  const previousEnv = { ...process.env };
  Object.assign(process.env, env);
  for (const key of ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"]) {
    if (!(key in env)) delete process.env[key];
  }

  const req = {
    method: request.method || "POST",
    body,
    headers: {
      accept: "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...request.headers,
    },
  };
  const res = createResponse();

  try {
    await contactHandler(req, res);
    return res;
  } finally {
    process.env = previousEnv;
  }
}

function validBody(overrides = {}) {
  return {
    name: "Producer",
    email: "producer@example.com",
    projectType: "Cultural documentary",
    message: "We are looking for a director for a bilingual project.",
    link: "https://example.com/brief",
    startedAt: String(Date.now() - 10_000),
    ...overrides,
  };
}

const mailEnv = {
  RESEND_API_KEY: "test_key",
  CONTACT_TO_EMAIL: "inquiries@example.com",
  CONTACT_FROM_EMAIL: "Portfolio <portfolio@example.com>",
};

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
    const res = await callContact(validBody(), mailEnv);

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

test("contact API returns friendly JSON when Resend fetch throws", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error("network down");
  };

  try {
    const res = await callContact(validBody({ email: "network@example.com" }), mailEnv);

    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { ok: false, error: "Unable to send the message." });
  } finally {
    global.fetch = originalFetch;
  }
});

test("contact API applies a basic per-client rate limit before sending email", async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return { ok: true, json: async () => ({ id: `email_${calls}` }) };
  };

  try {
    const first = await callContact(validBody({ email: "limit@example.com" }), mailEnv);
    const second = await callContact(validBody({ email: "limit@example.com" }), mailEnv);

    assert.equal(first.statusCode, 200);
    assert.equal(second.statusCode, 429);
    assert.equal(second.body.ok, false);
    assert.match(second.body.error, /too many/i);
    assert.equal(calls, 1);
  } finally {
    global.fetch = originalFetch;
  }
});

test("contact API accepts a native form post without startedAt and returns localized HTML", async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ id: "email_native" }) };
  };

  const nativeBody = new URLSearchParams({
    name: "No JavaScript Visitor",
    email: "native@example.com",
    projectType: "Documentary",
    message: "I would like to discuss a project without JavaScript.",
  }).toString();

  try {
    const res = await callContact(nativeBody, mailEnv, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "content-type": "application/x-www-form-urlencoded",
        referer: "https://hsinhsinyuan.com/zh/",
      },
    });

    assert.equal(res.statusCode, 200);
    assert.match(res.headers["Content-Type"], /^text\/html/);
    assert.match(res.headers.Vary, /Accept/);
    assert.equal(typeof res.body, "string");
    assert.match(res.body, /<html lang="zh-Hant">/);
    assert.match(res.body, /訊息已送出/);
    assert.match(res.body, /href="\/zh\/"/);
    assert.equal(calls.length, 1, "missing startedAt must not be classified as spam");
  } finally {
    global.fetch = originalFetch;
  }
});

test("contact API returns a usable HTML error for an invalid native form post", async () => {
  let fetchCalled = false;
  const originalFetch = global.fetch;
  global.fetch = async () => {
    fetchCalled = true;
    return { ok: true, json: async () => ({ id: "unexpected" }) };
  };

  const nativeBody = new URLSearchParams({
    name: "No JavaScript Visitor",
    email: "invalid-email",
    projectType: "Documentary",
    message: "Please reply when possible.",
  }).toString();

  try {
    const res = await callContact(nativeBody, mailEnv, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "content-type": "application/x-www-form-urlencoded",
        referer: "https://hsinhsinyuan.com/en/",
      },
    });

    assert.equal(res.statusCode, 400);
    assert.match(res.headers["Content-Type"], /^text\/html/);
    assert.equal(typeof res.body, "string");
    assert.match(res.body, /Message not sent/);
    assert.match(res.body, /href="\/en\/"/);
    assert.equal(fetchCalled, false);
  } finally {
    global.fetch = originalFetch;
  }
});
