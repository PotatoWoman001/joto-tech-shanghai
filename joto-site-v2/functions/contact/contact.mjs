const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const limits = {
  name: 100,
  company: 160,
  email: 254,
  phoneOrWechat: 100,
  message: 5000,
  website: 200,
};

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(input) {
  const fields = {
    name: text(input?.name),
    company: text(input?.company),
    email: text(input?.email),
    phoneOrWechat: text(input?.phoneOrWechat),
    message: text(input?.message),
    website: text(input?.website),
  };
  const errors = {};

  if (!fields.name) errors.name = "required";
  if (!fields.company) errors.company = "required";
  if (!fields.email) errors.email = "required";
  else if (!EMAIL_PATTERN.test(fields.email)) errors.email = "invalid";
  if (!fields.message) errors.message = "required";

  for (const [field, limit] of Object.entries(limits)) {
    if (fields[field].length > limit) errors[field] = "too_long";
  }

  if (fields.website) errors.website = "spam";
  return { fields, errors, valid: Object.keys(errors).length === 0 };
}

function cleanSubject(value) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 80);
}

export function buildMail(fields) {
  const phone = fields.phoneOrWechat || "Not provided";
  return {
    subject: cleanSubject(`Website enquiry — ${fields.company} — ${fields.name}`),
    textBody: [
      "New enquiry from jotoglobal.com",
      "",
      `Name: ${fields.name}`,
      `Company: ${fields.company}`,
      `Work email: ${fields.email}`,
      `Phone / WeChat: ${phone}`,
      "",
      "What they would like to solve:",
      fields.message,
    ].join("\n"),
  };
}
