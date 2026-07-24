import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

const captcha = {
  captchaId: "captcha-1",
  svg: "data:image/svg+xml;base64,PHN2Zy8+",
};

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: /name/i }), "Avery Chen");
  await user.type(screen.getByRole("textbox", { name: /company/i }), "Example Global");
  await user.type(screen.getByRole("textbox", { name: /work email/i }), "avery@example.com");
  await user.type(
    screen.getByRole("textbox", { name: /what would you like to solve/i }),
    "A multi-region network rollout.",
  );
}

describe("ContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads and refreshes the captcha", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(captcha))
      .mockResolvedValueOnce(jsonResponse({ ...captcha, captchaId: "captcha-2" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    expect(await screen.findByRole("img", { name: /security verification code/i }))
      .toHaveAttribute("src", captcha.svg);
    await user.click(screen.getByRole("button", { name: /refresh verification code/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("shows required-field errors after captcha is ready", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(captcha)));
    render(<ContactForm />);

    await screen.findByRole("img", { name: /security verification code/i });
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your company or organization.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your work email.")).toBeInTheDocument();
    expect(screen.getByText("Please tell us what you would like to solve.")).toBeInTheDocument();
  });

  it("requires a verification code", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(captcha)));
    render(<ContactForm />);
    await screen.findByRole("img", { name: /security verification code/i });
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send project brief/i }));
    expect(await screen.findByText("Please enter the verification code.")).toBeInTheDocument();
  });

  it("submits once to the unified backend and refreshes the captcha", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(captcha))
      .mockResolvedValueOnce(jsonResponse({ success: true, message: "提交成功" }))
      .mockResolvedValueOnce(jsonResponse({ ...captcha, captchaId: "captcha-2" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    await screen.findByRole("img", { name: /security verification code/i });
    await fillRequiredFields(user);
    await user.type(screen.getByRole("textbox", { name: /verification code/i }), "A7K9");
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(await screen.findByText(/project brief has been sent/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const submitBody = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(submitBody).toMatchObject({
      phone: "",
      phoneOrWechat: "",
      captchaId: "captcha-1",
      captchaText: "A7K9",
      locale: "en",
    });
  });

  it("keeps business fields and replaces an expired captcha", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(captcha))
      .mockResolvedValueOnce(jsonResponse({ success: false, error: "验证码已过期" }, 400))
      .mockResolvedValueOnce(jsonResponse({ ...captcha, captchaId: "captcha-2" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    await screen.findByRole("img", { name: /security verification code/i });
    await fillRequiredFields(user);
    await user.type(screen.getByRole("textbox", { name: /verification code/i }), "OLD1");
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(
      await screen.findByText("The verification code has expired. Please use the new code."),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("Avery Chen");
    expect(screen.getByRole("textbox", { name: /verification code/i }))
      .toHaveValue("");
    expect(screen.getByRole("textbox", { name: /verification code/i }))
      .toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("offers the sales email only for a generic delivery failure", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(captcha))
      .mockResolvedValueOnce(jsonResponse({ success: false, error: "delivery_failed" }, 502))
      .mockResolvedValueOnce(jsonResponse({ ...captcha, captchaId: "captcha-2" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    await screen.findByRole("img", { name: /security verification code/i });
    await fillRequiredFields(user);
    await user.type(screen.getByRole("textbox", { name: /verification code/i }), "A7K9");
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(await screen.findByText(/could not send your enquiry/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "sales@jototech.cn" })).toHaveAttribute(
      "href",
      "mailto:sales@jototech.cn",
    );
  });
});
