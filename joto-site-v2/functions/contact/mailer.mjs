import DmPackage, * as DmModels from "@alicloud/dm20151123";
import * as OpenApiModels from "@alicloud/openapi-client";
import { buildMail } from "./contact.mjs";

function required(name, env) {
  const value = env[name];
  if (!value) throw new Error(`Missing required mail configuration: ${name}`);
  return value;
}

function hasAll(env, names) {
  return names.every((name) => Boolean(env[name]));
}

export function mailProvider(env = process.env) {
  if (
    hasAll(env, [
      "RESEND_API_KEY",
      "RESEND_FROM_ADDRESS",
      "RESEND_TO_ADDRESS",
    ])
  ) {
    return "resend";
  }

  if (
    hasAll(env, [
      "ALIBABA_CLOUD_ACCESS_KEY_ID",
      "ALIBABA_CLOUD_ACCESS_KEY_SECRET",
      "ALIYUN_DM_ACCOUNT_NAME",
      "ALIYUN_DM_TO_ADDRESS",
    ])
  ) {
    return "aliyun";
  }

  return null;
}

export function createMailClient(env = process.env) {
  const config = new OpenApiModels.Config({
    accessKeyId: required("ALIBABA_CLOUD_ACCESS_KEY_ID", env),
    accessKeySecret: required("ALIBABA_CLOUD_ACCESS_KEY_SECRET", env),
  });
  config.endpoint = env.ALIYUN_DM_ENDPOINT || "dm.aliyuncs.com";
  const DmClient = DmPackage.default || DmPackage;
  return new DmClient(config);
}

export async function sendViaAliyun(fields, env = process.env) {
  const client = createMailClient(env);
  const mail = buildMail(fields);
  const request = new DmModels.SingleSendMailRequest({
    accountName: required("ALIYUN_DM_ACCOUNT_NAME", env),
    addressType: 1,
    replyToAddress: false,
    toAddress: required("ALIYUN_DM_TO_ADDRESS", env),
    subject: mail.subject,
    textBody: mail.textBody,
    fromAlias: env.ALIYUN_DM_FROM_ALIAS || "JOTO Website",
    clickTrace: "0",
  });

  return client.singleSendMail(request);
}

export async function sendViaResend(
  fields,
  env = process.env,
  fetchImpl = globalThis.fetch,
) {
  if (typeof fetchImpl !== "function") {
    throw new Error("Fetch API is unavailable");
  }

  const mail = buildMail(fields);
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${required("RESEND_API_KEY", env)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: required("RESEND_FROM_ADDRESS", env),
      to: [required("RESEND_TO_ADDRESS", env)],
      reply_to: fields.email,
      subject: mail.subject,
      text: mail.textBody,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend delivery failed with status ${response.status}`);
  }

  return response.json();
}

export async function sendContactEmail(
  fields,
  env = process.env,
  dependencies = {},
) {
  const provider = mailProvider(env);
  if (provider === "resend") {
    return (dependencies.resend || sendViaResend)(fields, env);
  }
  if (provider === "aliyun") {
    return (dependencies.aliyun || sendViaAliyun)(fields, env);
  }
  throw new Error("Mail service is not configured");
}
