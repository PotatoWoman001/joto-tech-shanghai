import http from "node:http";
import { pathToFileURL } from "node:url";
import { validateContact } from "./contact.mjs";
import { mailProvider, sendContactEmail } from "./mailer.mjs";

const MAX_BODY_BYTES = 16 * 1024;
const DEFAULT_ORIGINS = new Set([
  "https://jotoglobal.com",
  "https://www.jotoglobal.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

function sendJson(response, status, payload, requestId) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...(requestId ? { "X-Request-Id": requestId } : {}),
  });
  response.end(JSON.stringify(payload));
}

function allowedOrigins(env) {
  if (!env.ALLOWED_ORIGINS) return DEFAULT_ORIGINS;
  return new Set(env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    let body = "";
    let tooLarge = false;

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > MAX_BODY_BYTES) {
        tooLarge = true;
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      if (tooLarge) {
        reject(Object.assign(new Error("Request body too large"), { code: "BODY_TOO_LARGE" }));
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("Invalid JSON"), { code: "INVALID_JSON" }));
      }
    });
    request.on("error", reject);
  });
}

export function createRequestHandler({
  sendMail = sendContactEmail,
  env = process.env,
} = {}) {
  const origins = allowedOrigins(env);

  return async function handleContactRequest(request, response) {
    const requestId = request.headers["x-fc-request-id"] || request.headers["x-request-id"];
    const pathname = new URL(request.url || "/", "http://localhost").pathname;

    const origin = request.headers.origin;
    if (origin && !origins.has(origin)) {
      sendJson(response, 403, { ok: false, error: "origin_not_allowed" }, requestId);
      return;
    }
    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin");
    }

    if (request.method === "GET" && pathname === "/healthz") {
      sendJson(response, 200, { ok: true }, requestId);
      return;
    }
    if (pathname !== "/" && pathname !== "/api/contact") {
      sendJson(response, 404, { ok: false, error: "not_found" }, requestId);
      return;
    }
    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Cache-Control": "no-store",
      });
      response.end();
      return;
    }
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      sendJson(response, 405, { ok: false, error: "method_not_allowed" }, requestId);
      return;
    }

    if (!String(request.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
      sendJson(response, 415, { ok: false, error: "unsupported_media_type" }, requestId);
      return;
    }

    let payload;
    try {
      payload = await readJson(request);
    } catch (error) {
      const code = error?.code === "BODY_TOO_LARGE" ? "body_too_large" : "invalid_json";
      sendJson(response, 400, { ok: false, error: code }, requestId);
      return;
    }

    const validation = validateContact(payload);
    if (!validation.valid) {
      sendJson(response, 400, { ok: false, error: "validation_failed", fields: validation.errors }, requestId);
      return;
    }
    if (!mailProvider(env)) {
      sendJson(response, 503, { ok: false, error: "service_unavailable" }, requestId);
      return;
    }

    try {
      await sendMail(validation.fields, env);
      sendJson(response, 200, { ok: true }, requestId);
    } catch (error) {
      console.error("Contact email delivery failed", {
        requestId: requestId || "unknown",
        message: error instanceof Error ? error.message : "Unknown mail error",
      });
      response.setHeader("X-Fc-Status", "500");
      sendJson(response, 500, { ok: false, error: "delivery_failed" }, requestId);
    }
  };
}

export function startServer(options = {}) {
  const port = Number(process.env.PORT || 9000);
  const host = process.env.HOST || "0.0.0.0";
  const server = http.createServer(createRequestHandler(options));
  server.listen(port, host, () => {
    console.log(`JOTO contact function listening on ${host}:${port}`);
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
