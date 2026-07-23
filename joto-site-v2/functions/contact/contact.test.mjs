import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";
import { buildMail, validateContact } from "./contact.mjs";
import { createMailClient } from "./mailer.mjs";
import { createRequestHandler } from "./server.mjs";

const validPayload = {
  name: "Avery Chen",
  company: "Example Global",
  email: "avery@example.com",
  phoneOrWechat: "",
  message: "We need help with a multi-region network rollout.",
  website: "",
};

const configuredEnv = {
  ALIBABA_CLOUD_ACCESS_KEY_ID: "test-id",
  ALIBABA_CLOUD_ACCESS_KEY_SECRET: "test-secret",
  ALIYUN_DM_ACCOUNT_NAME: "website@example.com",
  ALIYUN_DM_TO_ADDRESS: "sales@example.com",
};

async function invoke(options, requestOptions = {}) {
  const request = Readable.from([requestOptions.body || ""]);
  request.method = requestOptions.method || "POST";
  request.url = requestOptions.path || "/api/contact";
  request.headers = requestOptions.headers || { "content-type": "application/json" };

  const response = {
    headers: {},
    status: 0,
    body: "",
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    writeHead(status, headers = {}) {
      this.status = status;
      for (const [name, value] of Object.entries(headers)) this.setHeader(name, value);
    },
    end(body = "") {
      this.body += body;
    },
  };

  await createRequestHandler(options)(request, response);
  return response;
}

test("validates required fields while allowing an empty phone or WeChat value", () => {
  assert.equal(validateContact(validPayload).valid, true);
  const invalid = validateContact({ ...validPayload, email: "not-an-email", message: "" });
  assert.deepEqual(invalid.errors, { email: "invalid", message: "required" });
});

test("rejects the hidden honeypot field", () => {
  const result = validateContact({ ...validPayload, website: "https://spam.example" });
  assert.equal(result.valid, false);
  assert.equal(result.errors.website, "spam");
});

test("builds a readable sales email without inventing an optional contact value", () => {
  const mail = buildMail(validPayload);
  assert.match(mail.subject, /Example Global/);
  assert.match(mail.textBody, /Phone \/ WeChat: Not provided/);
  assert.match(mail.textBody, /multi-region network rollout/);
});

test("creates an Alibaba Cloud Direct Mail client from server-side credentials", () => {
  const client = createMailClient(configuredEnv);
  assert.equal(typeof client.singleSendMail, "function");
});

test("accepts a valid same-origin JSON request and invokes the mail adapter", async () => {
  const deliveries = [];
  const response = await invoke(
    { env: configuredEnv, sendMail: async (fields) => deliveries.push(fields) },
    {
      headers: { "content-type": "application/json", origin: "https://jotoglobal.com" },
      body: JSON.stringify(validPayload),
    },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), { ok: true });
  assert.equal(deliveries.length, 1);
  assert.equal(deliveries[0].phoneOrWechat, "");
});

test("rejects invalid origins, media types and unconfigured delivery", async () => {
  const forbidden = await invoke(
    { env: configuredEnv, sendMail: async () => undefined },
    {
      headers: { "content-type": "application/json", origin: "https://attacker.example" },
      body: JSON.stringify(validPayload),
    },
  );
  assert.equal(forbidden.status, 403);

  const media = await invoke(
    { env: configuredEnv, sendMail: async () => undefined },
    { headers: {}, body: "plain text" },
  );
  assert.equal(media.status, 415);

  const preflight = await invoke(
    { env: configuredEnv, sendMail: async () => undefined },
    {
      method: "OPTIONS",
      headers: { origin: "https://jotoglobal.com" },
    },
  );
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers["access-control-allow-origin"], "https://jotoglobal.com");

  const unavailable = await invoke(
    { env: {}, sendMail: async () => undefined },
    {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validPayload),
    },
  );
  assert.equal(unavailable.status, 503);
});

test("returns a safe error when the mail adapter fails", async () => {
  const response = await invoke(
    {
      env: configuredEnv,
      sendMail: async () => {
        throw new Error("provider details that must stay server-side");
      },
    },
    {
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validPayload),
    },
  );
  assert.equal(response.status, 500);
  assert.equal(response.body.includes("provider details"), false);
});
