import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows required-field errors and focuses the first invalid field", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your company or organization.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your work email.")).toBeInTheDocument();
    expect(screen.getByText("Please tell us what you would like to solve.")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("textbox", { name: /name/i })).toHaveFocus());
  });

  it("submits successfully without a Phone or WeChat value", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Avery Chen");
    await user.type(screen.getByRole("textbox", { name: /company/i }), "Example Global");
    await user.type(screen.getByRole("textbox", { name: /work email/i }), "avery@example.com");
    await user.type(
      screen.getByRole("textbox", { name: /what would you like to solve/i }),
      "A multi-region network rollout.",
    );
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"phoneOrWechat":""'),
      }),
    );
    expect(await screen.findByText(/project brief has been sent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enquiry sent/i })).toBeDisabled();
  });

  it("offers the sales email when delivery fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<ContactForm />);

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Avery Chen");
    await user.type(screen.getByRole("textbox", { name: /company/i }), "Example Global");
    await user.type(screen.getByRole("textbox", { name: /work email/i }), "avery@example.com");
    await user.type(
      screen.getByRole("textbox", { name: /what would you like to solve/i }),
      "A security architecture review.",
    );
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(await screen.findByText(/could not send your enquiry/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "sales@jototech.cn" })).toHaveAttribute(
      "href",
      "mailto:sales@jototech.cn",
    );
  });
});
