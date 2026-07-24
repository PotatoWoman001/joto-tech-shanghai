import type { Locale } from "../i18n/routing";

export interface ContactFields {
  name: string;
  company: string;
  email: string;
  phoneOrWechat: string;
  message: string;
  website: string;
}

export interface CaptchaChallenge {
  captchaId: string;
  svg: string;
}

export interface ContactContext {
  locale: Locale;
  pageUrl: string;
  referrer: string;
}

export interface ContactPayload extends ContactFields {
  phone: string;
  captchaId: string;
  captchaText: string;
  locale: Locale;
  pageUrl: string;
  trafficSource: {
    source: string;
    medium: string;
    campaign: string;
    keyword: string;
    utm_content: string;
    referrer: string;
  };
}

export interface ContactSuccess {
  success: true;
  message?: string;
}

export type ContactErrorKey =
  | "Please enter the verification code."
  | "The verification code is incorrect."
  | "The verification code has expired. Please use the new code."
  | "We could not send your enquiry. Please try again or email";

export class ContactSubmissionError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ContactSubmissionError";
  }
}

type FetchLike = typeof fetch;

export async function loadCaptcha(
  fetchImpl: FetchLike = globalThis.fetch,
): Promise<CaptchaChallenge> {
  const response = await fetchImpl("/api/captcha", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Captcha request failed: ${response.status}`);
  const data = (await response.json()) as Partial<CaptchaChallenge>;
  if (typeof data.captchaId !== "string" || typeof data.svg !== "string") {
    throw new Error("Invalid captcha response");
  }
  return { captchaId: data.captchaId, svg: data.svg };
}

export function buildContactPayload(
  fields: ContactFields,
  challenge: CaptchaChallenge,
  captchaText: string,
  context: ContactContext,
): ContactPayload {
  const url = new URL(context.pageUrl);
  return {
    ...fields,
    phone: fields.phoneOrWechat,
    captchaId: challenge.captchaId,
    captchaText: captchaText.trim(),
    locale: context.locale,
    pageUrl: context.pageUrl,
    trafficSource: {
      source: url.searchParams.get("utm_source") || "",
      medium: url.searchParams.get("utm_medium") || "",
      campaign: url.searchParams.get("utm_campaign") || "",
      keyword: url.searchParams.get("utm_term") || "",
      utm_content: url.searchParams.get("utm_content") || "",
      referrer: context.referrer,
    },
  };
}

export async function submitContact(
  payload: ContactPayload,
  fetchImpl: FetchLike = globalThis.fetch,
): Promise<ContactSuccess> {
  const response = await fetchImpl("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    error?: string;
  };
  if (!response.ok || data.success !== true) {
    throw new ContactSubmissionError(data.error || "delivery_failed", response.status);
  }
  return { success: true, ...(data.message ? { message: data.message } : {}) };
}

export function contactErrorKey(error: unknown): ContactErrorKey {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("请输入验证码")) return "Please enter the verification code.";
  if (message.includes("验证码已过期") || message.includes("错误或已过期")) {
    return "The verification code has expired. Please use the new code.";
  }
  if (message.includes("验证码错误")) return "The verification code is incorrect.";
  return "We could not send your enquiry. Please try again or email";
}
