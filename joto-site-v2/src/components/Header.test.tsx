import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../i18n/I18nProvider";
import Header, { NAV_LINKS } from "./Header";

function renderHeader() {
  return render(
    <I18nProvider>
      <Header />
    </I18nProvider>,
  );
}

describe("Header", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    window.history.replaceState({}, "", "/");
  });

  it("keeps the navigation fixed and readable while the page scrolls", () => {
    const { container } = renderHeader();
    const header = container.querySelector("header");

    expect(header).toHaveClass("fixed", "inset-x-0", "top-0", "z-50");
    expect(header).toHaveClass("bg-[#070b0a]/90", "backdrop-blur-md");
    expect(header).not.toHaveClass("absolute");
  });

  it("renders the approved navigation destinations", () => {
    renderHeader();
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
    ).toHaveAttribute("href", "/solutions/network/cisco");

    expect(within(desktopNavigation).queryByRole("link", { name: "CONTACT" })).not.toBeInTheDocument();
    expect(within(desktopNavigation).getByRole("link", { name: "BLOG" })).toHaveAttribute(
      "href",
      "/blog",
    );

    const headerActions = screen.getByTestId("header-actions");
    const contact = within(headerActions).getByRole("link", { name: "CONTACT" });
    expect(contact).toHaveAttribute("href", "/contact");
    expect(contact.nextElementSibling).toHaveAttribute("aria-label", "Language selector");
  });

  it("opens the desktop solution directory on click without the redundant hierarchy label", async () => {
    const user = userEvent.setup();
    renderHeader();

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    const toggle = within(desktopNavigation).getByRole("button", { name: "SOLUTIONS" });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText("Solutions / Category / Vendor")).not.toBeInTheDocument();
  });

  it("keeps the desktop solution directory within the viewport", () => {
    renderHeader();
    const toggle = screen.getByRole("button", { name: "SOLUTIONS" });
    const directoryId = toggle.getAttribute("aria-controls");
    const directory = directoryId ? document.getElementById(directoryId) : null;

    expect(directory).toHaveClass(
      "fixed",
      "left-4",
      "right-4",
      "top-[75px]",
      "pt-px",
      "mx-auto",
      "max-w-[1100px]",
    );
    expect(directory).not.toHaveClass("pt-[28px]");
    expect(directory).toHaveAttribute("data-desktop-solutions-directory");
    expect(directory).not.toHaveClass("absolute", "right-0", "w-[min(1100px,92vw)]");
  });

  it("opens a full-screen mobile menu and closes it from a link", async () => {
    const user = userEvent.setup();
    renderHeader();

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
    expect(mobileNavigation.parentElement).toHaveClass(
      "absolute",
      "top-full",
      "h-[calc(100svh-76px)]",
    );
    await user.click(within(mobileNavigation).getByRole("link", { name: "SOLUTIONS" }));

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the mobile menu with Escape", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens the mobile solution hierarchy and links to a vendor anchor", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Open solution branches" }));

    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobileNavigation).getByRole("button", { name: "Network" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(within(mobileNavigation).getByRole("link", { name: "Cisco" })).toHaveAttribute(
      "href",
      "/solutions/network/cisco",
    );

    await user.click(within(mobileNavigation).getByRole("button", { name: "Security" }));
    expect(within(mobileNavigation).getByRole("button", { name: "Network" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(within(mobileNavigation).getByRole("link", { name: "KnowBe4" })).toHaveAttribute(
      "href",
      "/solutions/security/knowbe4",
    );
  });

  it("returns detail-page navigation to the corresponding home sections", () => {
    window.history.replaceState({}, "", "/solutions/network/cisco");
    renderHeader();

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    expect(screen.getByRole("link", { name: "JOTO TECH home" })).toHaveAttribute("href", "/#top");
    expect(within(desktopNavigation).getByRole("link", { name: "SERVICES" })).toHaveAttribute(
      "href",
      "/#services",
    );
    expect(
      within(desktopNavigation).getByRole("link", { name: "Aruba", hidden: true }),
    ).toHaveAttribute("href", "/solutions/network/aruba");
  });

  it("links representative vendors in every category to public detail routes", () => {
    renderHeader();
    const desktopNavigation = screen.getByRole("navigation", { name: "Primary navigation" });

    const expectedLinks = [
      ["Extreme Networks", "/solutions/network/extreme-networks"],
      ["Palo Alto Networks", "/solutions/security/palo-alto-networks"],
      ["Dell Technologies", "/solutions/server-storage/dell-technologies"],
      ["AudioCodes", "/solutions/collaboration/audiocodes"],
      ["Verkada", "/solutions/safeguarding/verkada"],
    ];

    for (const [name, href] of expectedLinks) {
      expect(within(desktopNavigation).getByRole("link", { name, hidden: true })).toHaveAttribute(
        "href",
        href,
      );
    }
  });

  it("returns About-page section links to the home page while keeping page routes direct", () => {
    window.history.replaceState({}, "", "/about");
    renderHeader();

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    expect(within(desktopNavigation).getByRole("link", { name: "SERVICES" })).toHaveAttribute(
      "href",
      "/#services",
    );
    expect(within(desktopNavigation).getByRole("link", { name: "ABOUT" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(within(desktopNavigation).getByRole("link", { name: "BLOG" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("includes Blog and Contact in the mobile menu", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });

    expect(within(mobileNavigation).getByRole("link", { name: "BLOG" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(within(mobileNavigation).getByRole("link", { name: "CONTACT" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
