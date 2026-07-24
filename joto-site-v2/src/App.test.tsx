import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { featureFlags } from "./config/features";
import { I18nProvider } from "./i18n/I18nProvider";

function renderApp() {
  return render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
}

describe("JOTO TECH single-page website", () => {
  afterEach(() => {
    featureFlags.customerLogoWall = true;
    window.history.replaceState({}, "", "/");
  });

  it("places the enabled customer logo wall between Selected Experience and About JOTO", () => {
    const { container } = renderApp();
    const caseStudies = container.querySelector("#case-studies") as HTMLElement;
    const logoWall = container.querySelector("[data-customer-logo-wall-slot]") as HTMLElement;
    const about = container.querySelector("#about") as HTMLElement;

    expect(caseStudies.compareDocumentPosition(logoWall)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(logoWall.compareDocumentPosition(about)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("can hide the customer logo wall through the retained feature flag", () => {
    featureFlags.customerLogoWall = false;
    const { container } = renderApp();

    expect(container.querySelector("#customer-logo-wall")).not.toBeInTheDocument();
  });

  it("renders the approved hero message and supporting statement", () => {
    const { container } = renderApp();
    const hero = container.querySelector('section[aria-labelledby="hero-title"]');
    const region = within(hero as HTMLElement);
    const eyebrow = region.getByText("ENTERPRISE-READY IT SOLUTIONS");
    const heading = region.getByRole("heading", {
      level: 1,
      name: "We Make IT Happen.",
    });
    const description = region.getByText(
      "Enterprise networks, security, data centers, collaboration and physical safeguarding — designed, built and supported for the world's most demanding companies since 2010.",
    );
    const accentWord = hero?.querySelector(".hero-accent-word");

    expect(heading).toBeInTheDocument();
    expect(accentWord).toHaveClass("text-joto-green");
    expect(eyebrow.compareDocumentPosition(heading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(heading.compareDocumentPosition(description)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("uses the tailored Chinese hero alignment and natural case-study copy", () => {
    window.history.replaceState({}, "", "/zh/");

    const { container } = renderApp();
    const primaryLine = container.querySelector('[data-hero-line="primary"]');
    const secondaryLine = container.querySelector('[data-hero-line="secondary"]');

    expect(primaryLine).toHaveClass("pl-[0.5em]");
    expect(secondaryLine).not.toHaveClass("sm:pl-[0.65em]");
    expect(
      screen.getByText("跨越不同行业，让复杂的技术项目稳定落地、持续运行。"),
    ).toBeInTheDocument();
  });

  it("renders every primary navigation target", () => {
    const { container } = renderApp();

    for (const id of ["solutions", "services", "case-studies", "about", "contact"]) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }
  });

  it("renders five solution cards with partner detail links", () => {
    const { container } = renderApp();
    const solutions = container.querySelector("#solutions");
    expect(solutions).not.toBeNull();
    const region = within(solutions as HTMLElement);

    for (const heading of ["Network", "Security", "Server & Storage", "Collaboration", "Safeguarding"]) {
      expect(region.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(region.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    const scroller = solutions?.querySelector(
      "[data-solutions-scroller]",
    ) as HTMLElement;

    expect(scroller).toHaveClass("flex", "overflow-x-auto", "snap-x");
    expect(
      scroller.querySelectorAll("[data-solution-card-slot]"),
    ).toHaveLength(5);
    expect(solutions?.querySelectorAll("[data-solution-card]")).toHaveLength(5);
    expect(region.getAllByRole("link")).toHaveLength(5);
    expect(region.getAllByText("Learn more")).toHaveLength(5);
    expect(region.getAllByRole("img")).toHaveLength(5);
    expect(region.queryByText("Cisco")).not.toBeInTheDocument();
    expect(container.querySelector("#solution-network-cisco")).toBeInTheDocument();
  });

  it("localizes the solution card action in Chinese", () => {
    window.history.replaceState({}, "", "/zh/");

    const { container } = renderApp();
    const solutions = container.querySelector("#solutions") as HTMLElement;

    expect(within(solutions).getAllByText("了解更多")).toHaveLength(5);
    expect(
      within(solutions).getByRole("link", { name: "了解更多: 网络" }),
    ).toHaveAttribute("href", "/zh/solutions/network/cisco");
  });

  it("keeps the JD International logo in its original colors", () => {
    renderApp();
    const logo = screen.getByRole("img", { name: "JD International logo" });

    expect(logo).not.toHaveClass("brightness-0");
    expect(logo).not.toHaveClass("invert");
  });

  it("shows the complete business page with the partner wall before the global delivery map", () => {
    const { container } = renderApp();
    const partners = container.querySelector("#partners") as HTMLElement;
    const globalPresence = container.querySelector("#global-presence") as HTMLElement;

    expect(document.querySelector("#services h2")).toBeInTheDocument();
    expect(document.querySelector("#case-studies")).toBeInTheDocument();
    expect(partners).toBeInTheDocument();
    expect(globalPresence).toBeInTheDocument();
    expect(partners.compareDocumentPosition(globalPresence)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(
      screen.getByRole("img", { name: /world map showing JOTO's international delivery footprint/i }),
    ).toBeInTheDocument();
  });

  it("protects long about statistics from overflowing their cards", () => {
    renderApp();

    expect(screen.getByText("LIFECYCLE")).toHaveClass("break-words");
    expect(screen.getByText("MULTI-VENDOR")).toHaveClass("break-words");
  });

  it("contains none of the excluded legacy product language", () => {
    const { container } = renderApp();
    const forbidden = [
      ["JOTO", " ", "AI"].join(""),
      ["Di", "fy"].join(""),
      ["AI", "GC"].join(""),
      ["Code", "Nest"].join(""),
    ];

    for (const term of forbidden) {
      expect(container.textContent?.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });

  it("renders the Cisco partner detail at its public pathname", () => {
    window.history.replaceState({}, "", "/solutions/network/cisco");

    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: /Cisco solutions, delivered by JOTO/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "We Make IT Happen." })).not.toBeInTheDocument();
  });

  it("renders a non-network partner detail at its public pathname", () => {
    window.history.replaceState({}, "", "/solutions/security/palo-alto-networks");

    const { container } = renderApp();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Palo Alto Networks integrated protection, carry consistent policy across every business boundary/i,
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-network-telemetry]")).not.toBeInTheDocument();
    expect(screen.queryByText(/Cisco × JOTO/)).not.toBeInTheDocument();
  });

  it("renders the complete About page at its public pathname", () => {
    window.history.replaceState({}, "", "/about");

    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: /Built to make complex IT happen/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Advisors first/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open the JOTO contact page" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByText("MULTI-VENDOR")).toHaveClass("whitespace-nowrap");
    expect(screen.getByText("LIFECYCLE")).toHaveClass("whitespace-nowrap");
  });

  it("renders the Contact page and optional Phone or WeChat field", () => {
    window.history.replaceState({}, "", "/contact");

    const { container } = renderApp();

    expect(
      screen.queryByRole("heading", { level: 1, name: /Tell us what you’re building/i }),
    ).not.toBeInTheDocument();
    expect(container.querySelector("[data-contact-form-section]")).toHaveClass(
      "pt-32",
      "sm:pt-36",
      "lg:pt-40",
    );
    expect(
      within(container.querySelector("header") as HTMLElement).getByRole("link", {
        name: "JOTO TECH home",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Phone / WeChat" })).not.toBeRequired();
    expect(screen.getByRole("heading", { name: /Find JOTO nearby/i })).toBeInTheDocument();
  });

  it("uses the approved two-line Chinese About title and larger stat labels", () => {
    window.history.replaceState({}, "", "/zh/about");

    const { container } = renderApp();
    const title = screen.getByRole("heading", {
      level: 1,
      name: "让复杂 IT 项目 顺利落地。",
    });
    const titleLines = title.querySelectorAll("[data-about-title-line]");
    const quote = screen.getByText((_, element) =>
      element?.tagName === "BLOCKQUOTE"
        ? element.textContent === "“专业服务，持续创新，以客户成功为目标。”"
        : false,
    );

    expect(titleLines).toHaveLength(2);
    expect(titleLines[0]).toHaveTextContent("让复杂 IT 项目");
    expect(titleLines[1]).toHaveTextContent("顺利落地。");
    expect(quote.querySelector("br")).toBeInTheDocument();
    expect(container.querySelector("[data-about-stat-label]")).toHaveClass(
      "text-xs",
      "md:text-sm",
    );
  });
});
