import { describe, expect, it, vi } from "vitest";
import {
  ContactSubmissionError,
  buildContactPayload,
  contactErrorKey,
  loadCaptcha,
  submitContact,
} from "./contactApi";

const fields = {
  name: "Avery Chen",
  company: "Example Global",
  email: "avery@example.com",
  phoneOrWechat: "wechat-avery",
  message: "A multi-region network rollout.",
  website: "",
};

describe("contactApi", () => {
  it("loads a valid captcha challenge from the same-origin endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(loadCaptcha(fetchMock)).resolves.toEqual({
      captchaId: "captcha-1",
      svg: "data:image/svg+xml;base64,PHN2Zy8+",
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/captcha", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  });

  it("rejects malformed captcha responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ captchaId: "captcha-1" }), { status: 200 }),
    );

    await expect(loadCaptcha(fetchMock)).rejects.toThrow("Invalid captcha response");
  });

  it("builds the backend-compatible payload and preserves traffic attribution", () => {
    const payload = buildContactPayload(
      fields,
      { captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" },
      "A7K9",
      {
        locale: "zh-CN",
        pageUrl:
          "https://jotoglobal.com/zh/contact?utm_source=baidu&utm_medium=cpc&utm_campaign=q3&utm_term=sdwan&utm_content=hero",
        referrer: "https://www.baidu.com/",
      },
    );

    expect(payload).toMatchObject({
      name: "Avery Chen",
      company: "Example Global",
      email: "avery@example.com",
      phone: "wechat-avery",
      phoneOrWechat: "wechat-avery",
      message: "A multi-region network rollout.",
      website: "",
      captchaId: "captcha-1",
      captchaText: "A7K9",
      locale: "zh-CN",
      trafficSource: {
        source: "baidu",
        medium: "cpc",
        campaign: "q3",
        keyword: "sdwan",
        utm_content: "hero",
        referrer: "https://www.baidu.com/",
      },
    });
  });

  it("submits to the same-origin contact endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, message: "提交成功" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const payload = buildContactPayload(
      fields,
      { captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" },
      "A7K9",
      { locale: "en", pageUrl: "https://jotoglobal.com/contact", referrer: "" },
    );

    await expect(submitContact(payload, fetchMock)).resolves.toEqual({
      success: true,
      message: "提交成功",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  });

  it("maps backend captcha failures without exposing unrelated errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: false, error: "验证码已过期" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      submitContact(
        buildContactPayload(
          fields,
          { captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" },
          "A7K9",
          { locale: "en", pageUrl: "https://jotoglobal.com/contact", referrer: "" },
        ),
        fetchMock,
      ),
    ).rejects.toEqual(new ContactSubmissionError("验证码已过期", 400));

    expect(contactErrorKey(new ContactSubmissionError("验证码错误", 400))).toBe(
      "The verification code is incorrect.",
    );
    expect(contactErrorKey(new ContactSubmissionError("验证码已过期", 400))).toBe(
      "The verification code has expired. Please use the new code.",
    );
    expect(contactErrorKey(new ContactSubmissionError("验证码错误或已过期", 400))).toBe(
      "The verification code has expired. Please use the new code.",
    );
    expect(contactErrorKey(new Error("socket failure"))).toBe(
      "We could not send your enquiry. Please try again or email",
    );
  });
});
