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

    expect(heading).toBeInTheDocument();
    expect(eyebrow.compareDocumentPosition(heading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(heading.compareDocumentPosition(description)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders every primary navigation target", () => {
    const { container } = renderApp();

    for (const id of ["solutions", "services", "case-studies", "about", "contact"]) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }
  });

  it("renders the five solution categories without empty detail links", () => {
    const { container } = renderApp();
    const solutions = container.querySelector("#solutions");
    expect(solutions).not.toBeNull();
    const region = within(solutions as HTMLElement);

    for (const heading of ["Network", "Security", "Server & Storage", "Collaboration", "Safeguarding"]) {
      expect(region.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(region.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(region.queryAllByRole("link")).toHaveLength(0);
    expect(region.getAllByRole("img")).toHaveLength(5);
    expect(region.queryByText("Cisco")).not.toBeInTheDocument();
    expect(container.querySelector("#solution-network-cisco")).toBeInTheDocument();
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
      screen.getByRole("heading", { level: 1, name: /Palo Alto Networks solutions/i }),
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

    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: /Tell us what you’re building/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Phone / WeChat" })).not.toBeRequired();
    expect(screen.getByRole("heading", { name: /Find JOTO nearby/i })).toBeInTheDocument();
  });
});
