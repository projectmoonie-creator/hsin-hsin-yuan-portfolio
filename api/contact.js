const MAX_FIELD_LENGTH = 3000;
const MIN_SUBMIT_MS = 2500;

function json(res, statusCode, body) {
  res.status(statusCode);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.json(body);
}

function clean(value, max = MAX_FIELD_LENGTH) {
  return String(value ?? "").trim().slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readStream(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    const params = new URLSearchParams(req.body);
    return Object.fromEntries(params.entries());
  }

  const raw = await readStream(req);
  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

function isSpam(body) {
  if (clean(body.website, 200)) return true;

  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_SUBMIT_MS) return true;

  return false;
}

function buildMessage(body) {
  const fields = {
    name: clean(body.name, 160),
    email: clean(body.email, 240),
    projectType: clean(body.projectType, 240),
    link: clean(body.link, 500),
    message: clean(body.message),
  };

  return {
    fields,
    text: [
      "New portfolio inquiry",
      "",
      `Name: ${fields.name}`,
      `Email: ${fields.email}`,
      `Project type: ${fields.projectType}`,
      fields.link ? `Link: ${fields.link}` : "",
      "",
      "Message:",
      fields.message,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export default async function contactHandler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed." });

  const body = await parseBody(req);
  if (isSpam(body)) return json(res, 200, { ok: true });

  const { fields, text } = buildMessage(body);
  if (!fields.name || !fields.email || !fields.projectType || !fields.message || !isEmail(fields.email)) {
    return json(res, 400, { ok: false, error: "Please complete the required fields." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return json(res, 503, { ok: false, error: "Contact email is not configured." });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: fields.email,
      subject: `Portfolio inquiry: ${fields.projectType}`,
      text,
    }),
  });

  if (!response.ok) {
    return json(res, 502, { ok: false, error: "Unable to send the message." });
  }

  return json(res, 200, { ok: true });
}
