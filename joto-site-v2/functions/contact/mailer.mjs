import DmPackage, * as DmModels from "@alicloud/dm20151123";
import * as OpenApiModels from "@alicloud/openapi-client";
import { buildMail } from "./contact.mjs";

function required(name, env) {
  const value = env[name];
  if (!value) throw new Error(`Missing required mail configuration: ${name}`);
  return value;
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
