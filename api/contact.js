const MAX_FIELD_LENGTH = 3000;
const MIN_SUBMIT_MS = 2500;
const RATE_LIMIT_MS = 60 * 1000;
const submissions = new Map();

function json(res, statusCode, body) {
  res.status(statusCode);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Accept");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.json(body);
}

function requestHeader(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value.join(",") : String(value ?? "");
}

function requestLocale(req) {
  const referer = requestHeader(req, "referer");
  try {
    if (/^\/zh(?:\/|$)/.test(new URL(referer).pathname)) return "zh";
  } catch {
    // Fall through to the browser language when the referrer is absent or invalid.
  }

  return /(^|,)\s*zh(?:-|,|;|$)/i.test(requestHeader(req, "accept-language")) ? "zh" : "en";
}

function html(res, statusCode, body, locale) {
  const isZh = locale === "zh";
  const isSuccess = body.ok;
  const copy = isZh
    ? {
        lang: "zh-Hant",
        label: "合作邀請",
        title: isSuccess ? "訊息已送出" : "訊息尚未送出",
        message: isSuccess
          ? "謝謝你，這封合作邀請已經寄出。"
          : statusCode === 400
            ? "請確認必填欄位與電子信箱格式後再試一次。"
            : "目前無法送出訊息，請稍候再試。",
        back: "返回作品集",
        href: "/zh/",
      }
    : {
        lang: "en",
        label: "Portfolio inquiry",
        title: isSuccess ? "Message sent" : "Message not sent",
        message: isSuccess
          ? "Thank you. Your inquiry has been sent."
          : statusCode === 400
            ? "Please check the required fields and email address, then try again."
            : "The message could not be sent right now. Please try again shortly.",
        back: "Back to the portfolio",
        href: "/en/",
      };

  const document = `<!doctype html>
<html lang="${copy.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${copy.title}</title>
  <style>
    :root { color-scheme: light; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 1.5rem; background: #f6f4ee; color: #050807; }
    main { width: min(100%, 42rem); padding: clamp(2rem, 7vw, 5rem); border: 1px solid #050807; border-radius: 2rem; background: #dddcd7; }
    p { max-width: 34rem; font-size: 1.05rem; line-height: 1.6; }
    .label { margin: 0 0 1rem; font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    h1 { margin: 0; font-family: Iowan Old Style, Baskerville, serif; font-size: clamp(2.5rem, 9vw, 5.5rem); font-style: italic; font-weight: 400; line-height: .95; }
    a { display: inline-block; margin-top: 1.25rem; padding: .8rem 1.1rem; border: 1px solid currentColor; border-radius: 999px; color: inherit; font-weight: 700; }
    a:focus-visible { outline: 3px solid #4867d9; outline-offset: 4px; }
  </style>
</head>
<body>
  <main>
    <p class="label">${copy.label}</p>
    <h1>${copy.title}</h1>
    <p>${copy.message}</p>
    <a href="${copy.href}">${copy.back}</a>
  </main>
</body>
</html>`;

  res.status(statusCode);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Accept");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.end(document);
}

function respond(req, res, statusCode, body) {
  if (requestHeader(req, "accept").toLowerCase().includes("application/json")) {
    return json(res, statusCode, body);
  }

  return html(res, statusCode, body, requestLocale(req));
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

  const startedAtValue = clean(body.startedAt, 40);
  if (!startedAtValue) return false;

  const startedAt = Number(startedAtValue);
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

function clientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(req, fields) {
  const now = Date.now();
  for (const [key, timestamp] of submissions.entries()) {
    if (now - timestamp > RATE_LIMIT_MS) submissions.delete(key);
  }

  const key = `${clientIp(req)}:${fields.email.toLowerCase()}`;
  const previous = submissions.get(key);
  if (previous && now - previous < RATE_LIMIT_MS) return true;

  submissions.set(key, now);
  return false;
}

export default async function contactHandler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return respond(req, res, 405, { ok: false, error: "Method not allowed." });

  const body = await parseBody(req);
  if (isSpam(body)) return respond(req, res, 200, { ok: true });

  const { fields, text } = buildMessage(body);
  if (!fields.name || !fields.email || !fields.projectType || !fields.message || !isEmail(fields.email)) {
    return respond(req, res, 400, { ok: false, error: "Please complete the required fields." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return respond(req, res, 503, { ok: false, error: "Contact email is not configured." });
  }

  if (isRateLimited(req, fields)) {
    return respond(req, res, 429, { ok: false, error: "Too many messages. Please wait before sending another message." });
  }

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
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
  } catch {
    return respond(req, res, 502, { ok: false, error: "Unable to send the message." });
  }

  if (!response.ok) {
    return respond(req, res, 502, { ok: false, error: "Unable to send the message." });
  }

  return respond(req, res, 200, { ok: true });
}
