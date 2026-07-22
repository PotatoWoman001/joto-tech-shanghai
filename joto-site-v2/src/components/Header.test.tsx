import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import Header, { NAV_LINKS } from "./Header";

describe("Header", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders the approved navigation destinations", () => {
    render(<Header />);
    const desktopNavigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    expect(within(desktopNavigation).getByRole("button", { name: "SOLUTIONS" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    for (const link of NAV_LINKS.slice(1)) {
      expect(within(desktopNavigation).getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      );
    }

    expect(
      within(desktopNavigation).getByRole("link", { name: "Cisco", hidden: true }),
    ).toHaveAttribute("href", "#solution-network-cisco");
  });

  it("opens the desktop solution directory on click without the redundant hierarchy label", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    const toggle = within(desktopNavigation).getByRole("button", { name: "SOLUTIONS" });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText("Solutions / Category / Vendor")).not.toBeInTheDocument();
  });

  it("opens a full-screen mobile menu and closes it from a link", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.body.style.overflow).toBe("hidden");

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    await user.click(within(mobileNavigation).getByRole("link", { name: "SOLUTIONS" }));

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the mobile menu with Escape", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens the mobile solution hierarchy and links to a vendor anchor", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Open solution branches" }));

    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobileNavigation).getByRole("button", { name: "Network" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(within(mobileNavigation).getByRole("link", { name: "Cisco" })).toHaveAttribute(
      "href",
      "#solution-network-cisco",
    );

    await user.click(within(mobileNavigation).getByRole("button", { name: "Security" }));
    expect(within(mobileNavigation).getByRole("button", { name: "Network" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(within(mobileNavigation).getByRole("link", { name: "KnowBe4" })).toHaveAttribute(
      "href",
      "#solution-security-knowbe4",
    );
  });
});
