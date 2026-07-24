import fs from "node:fs";

const sourcePath = "/var/www/audit/backend/data/config.json";
const outputPath = "/etc/jotoglobal-contact.env";
const config = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const email = config.emailConfig || {};

function required(name, value) {
  if (!value) throw new Error(`Existing server mail configuration lacks ${name}`);
  return String(value);
}

function quote(value) {
  return `"${String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\n", "\\n")}"`;
}

const values = {
  PORT: "9000",
  HOST: "127.0.0.1",
  RESEND_API_KEY: required("emailConfig.resendApiKey", email.resendApiKey),
  RESEND_FROM_ADDRESS: required("emailConfig.from", email.from),
  RESEND_TO_ADDRESS: required(
    "email or emailConfig.adminEmail",
    config.email || email.adminEmail,
  ),
  ALLOWED_ORIGINS:
    "https://jotoglobal.com,https://www.jotoglobal.com",
};

const body = `${Object.entries(values)
  .map(([name, value]) => `${name}=${quote(value)}`)
  .join("\n")}\n`;

fs.writeFileSync(outputPath, body, { mode: 0o600 });
fs.chmodSync(outputPath, 0o600);
console.log(`Created protected environment file: ${outputPath}`);
