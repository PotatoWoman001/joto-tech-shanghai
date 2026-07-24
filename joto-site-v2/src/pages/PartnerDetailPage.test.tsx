import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getPartnerDetail } from "../content/partners";
import { I18nProvider } from "../i18n/I18nProvider";
import { localizePartnerDetail } from "../i18n/translations";
import PartnerDetailPage from "./PartnerDetailPage";

function renderDetail(pathname: string, locale: "en" | "zh-CN" | "fa-IR" = "en") {
  const detail = localizePartnerDetail(locale, getPartnerDetail(pathname));
  expect(detail).toBeDefined();

  return {
    detail: detail!,
    ...render(
      <I18nProvider>
        <PartnerDetailPage detail={detail!} />
      </I18nProvider>,
    ),
  };
}

describe("PartnerDetailPage", () => {
  it("renders the complete Cisco × JOTO story from partner data", () => {
    const { container, detail } = renderDetail("/solutions/network/cisco");

    expect(
      screen.getByRole("heading", { level: 1, name: /Cisco solutions, delivered by JOTO/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("delivered by JOTO.")).toHaveClass(
      "text-[clamp(2.35rem,3.8vw,3.55rem)]",
      "leading-[0.96]",
      "text-balance",
    );
    expect(screen.getByText("Cisco solutions,")).toHaveClass(
      "text-[clamp(3rem,5.7vw,6rem)]",
      "lg:whitespace-nowrap",
    );
    expect(screen.getAllByText("Cisco × JOTO")).toHaveLength(1);
    expect(screen.getByRole("img", { name: "Cisco logo" })).toHaveClass(
      "max-h-7",
      "max-w-[132px]",
    );
    const goldBadge = screen.getByText("Gold Partner");
    expect(goldBadge).toHaveAttribute(
      "data-partner-badge",
      "Gold Partner",
    );
    expect(goldBadge.parentElement).toHaveClass("basis-full");
    expect(goldBadge.parentElement).not.toHaveClass("lg:basis-auto");
    expect(screen.getByRole("img", { name: detail!.heroVisual.alt })).toBeInTheDocument();
    expect(container.querySelector("[data-cisco-network-topology]")).toBeInTheDocument();
    expect(container.querySelector("[data-solution-visual]")).not.toBeInTheDocument();
    expect(container.querySelector("[data-cisco-device-stage]")).toHaveClass(
      "lg:-ml-8",
      "lg:mr-[-3vw]",
      "xl:-ml-28",
      "xl:mr-[-7vw]",
    );
    expect(container.querySelectorAll("[data-switch-port]")).toHaveLength(12);
    expect(container.querySelectorAll("[data-ap-node]")).toHaveLength(2);
    expect(screen.getByText("CATALYST CENTER / SITE-01")).toBeInTheDocument();

    const services = container.querySelector("#partner-services");
    const relationship = container.querySelector("#partner-relationship");
    const customerLogoWall = container.querySelector("[data-partner-customer-logo-wall]");

    expect(relationship).not.toBeNull();
    expect(customerLogoWall).not.toBeNull();
    expect(customerLogoWall?.querySelector("#customer-logo-wall")).toBeInTheDocument();
    expect(customerLogoWall?.querySelectorAll("[data-logo-sequence]")).toHaveLength(2);
    expect(customerLogoWall?.querySelectorAll('[data-logo-sequence="primary"]')).toHaveLength(1);
    expect(customerLogoWall?.querySelectorAll('[data-logo-sequence="duplicate"]')).toHaveLength(1);
    expect(relationship?.contains(customerLogoWall)).toBe(true);
    expect(customerLogoWall?.compareDocumentPosition(services as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(services).not.toBeNull();
    expect(within(services as HTMLElement).getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(within(services as HTMLElement).getAllByRole("img")).toHaveLength(3);
    for (const service of detail!.services) {
      expect(
        within(services as HTMLElement).getByRole("img", { name: service.imageAlt }),
      ).toBeInTheDocument();
      expect(within(services as HTMLElement).getByLabelText(`${service.title} icon`)).toHaveClass(
        "border-joto-green/45",
        "bg-joto-green/10",
        "text-joto-green",
      );
    }

    const cases = container.querySelector("#partner-case-studies");
    expect(cases).not.toBeNull();
    expect(within(cases as HTMLElement).getAllByRole("article")).toHaveLength(3);
    const chewyLogo = within(cases as HTMLElement).getByRole("img", { name: "Chewy logo" });
    expect(chewyLogo).toHaveAttribute("data-logo-treatment", "monochrome");
    expect(chewyLogo).toHaveAttribute("data-case-logo-size", "standard");
    expect(chewyLogo).toHaveClass("h-12", "w-[150px]", "object-contain", "object-left");
    expect(chewyLogo).not.toHaveClass("max-h-12", "w-auto", "max-w-[150px]");
    expect(chewyLogo).toHaveClass("brightness-0", "invert");
    const harrowLogo = within(cases as HTMLElement).getByRole("img", {
      name: "Harrow International School logo",
    });
    expect(harrowLogo).toHaveClass("h-24", "w-[100px]");
    expect(harrowLogo).toHaveAttribute("data-case-logo-size", "portrait");

    expect(screen.getByRole("link", { name: /View Cisco case studies/i })).toHaveAttribute(
      "href",
      "#partner-case-studies",
    );
    expect(screen.getByRole("link", { name: "Contact JOTO" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: /Start a conversation/i })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.queryByText(detail!.heroVisual.caption)).not.toBeInTheDocument();
  });

  it("renders vendor-specific copy and a category visual without Cisco telemetry", () => {
    const { container, detail } = renderDetail("/solutions/security/palo-alto-networks");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Palo Alto Networks integrated protection/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Palo Alto Networks × JOTO")).toHaveLength(1);
    const platinumBadge = screen.getByText("Platinum Partner");
    expect(platinumBadge).toHaveAttribute(
      "data-partner-badge",
      "Platinum Partner",
    );
    expect(platinumBadge.parentElement).toHaveClass("basis-full");
    expect(platinumBadge.parentElement).not.toHaveClass("lg:basis-auto");
    expect(
      screen.getByRole("link", { name: /View Palo Alto Networks case studies/i }),
    ).toHaveAttribute("href", "#partner-case-studies");
    const cases = container.querySelector("#partner-case-studies");
    expect(cases).toBeInTheDocument();
    expect(within(cases as HTMLElement).getAllByRole("article")).toHaveLength(3);
    const starbucksLogo = within(cases as HTMLElement).getByRole("img", {
      name: "Starbucks China logo",
    });
    expect(starbucksLogo).toHaveClass(
      "h-12",
      "w-[150px]",
      "object-contain",
      "object-left",
      "opacity-100",
    );
    expect(starbucksLogo).not.toHaveClass("brightness-0", "invert");
    expect(starbucksLogo).toHaveAttribute("data-logo-treatment", "brand");
    const dulwichLogo = within(cases as HTMLElement).getByRole("img", {
      name: "Dulwich College International Schools logo",
    });
    expect(dulwichLogo).toHaveClass("opacity-90", "brightness-0", "invert");
    expect(dulwichLogo).toHaveAttribute("data-logo-treatment", "monochrome");
    expect(
      within(cases as HTMLElement).getByText("PA-5430 / PA-5250 / PA-5220 / PA-3250"),
    ).toBeInTheDocument();
    expect(within(cases as HTMLElement).getByText(/2022–2025/)).toBeInTheDocument();
    expect(container.querySelector("[data-network-telemetry]")).not.toBeInTheDocument();
    expect(screen.getByText("Palo Alto Networks integrated protection,")).toHaveClass(
      "text-[clamp(3rem,4.7vw,5.2rem)]",
      "text-balance",
      "break-words",
    );
    expect(
      screen.getByText("carry consistent policy across every business boundary."),
    ).toHaveClass(
      "text-[clamp(2.35rem,3.8vw,3.55rem)]",
      "leading-[0.96]",
      "text-balance",
    );
    expect(container.querySelector('[data-solution-visual="security"]')).toBeInTheDocument();
    expect(container.querySelector("[data-solution-visual-motion]")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: detail.heroVisual.alt })).toHaveClass(
      "partner-solution-visual__image",
    );
    expect(screen.queryByText(/Cisco infrastructure, proven in the field/i)).not.toBeInTheDocument();
  });

  it("keeps verified text fallbacks for clients without official logo files", () => {
    const { container } = renderDetail("/solutions/security/palo-alto-networks");
    const cases = container.querySelector("#partner-case-studies") as HTMLElement;
    const jinnetHeading = within(cases).getByRole("heading", { level: 3, name: "Jinnet" });
    const jinnetArticle = jinnetHeading.closest("article");

    expect(jinnetArticle).toHaveTextContent("Jinnet");
    expect(
      within(jinnetArticle as HTMLElement).queryByRole("img", { name: "Jinnet logo" }),
    ).not.toBeInTheDocument();
  });

  it("uses a high-contrast knockout treatment for Pall logos", () => {
    const { container } = renderDetail("/solutions/network/sangfor");
    const cases = container.querySelector("#partner-case-studies") as HTMLElement;
    const pallLogo = within(cases).getByRole("img", {
      name: "Pall Filter (Beijing) logo",
    });

    expect(pallLogo).toHaveClass("opacity-90", "brightness-0", "invert");
    expect(pallLogo).toHaveAttribute("data-logo-treatment", "monochrome");
  });

  it.each([
    ["/solutions/network/extreme-networks", "network"],
    ["/solutions/security/fortinet", "security"],
    ["/solutions/server-storage/dell-technologies", "server-storage"],
    ["/solutions/collaboration/audiocodes", "collaboration"],
    ["/solutions/safeguarding/verkada", "safeguarding"],
  ])("uses the category-aware borderless hero visual for %s", (pathname, category) => {
    const { container, detail } = renderDetail(pathname);
    const visual = container.querySelector(`[data-solution-visual="${category}"]`);

    expect(visual).toBeInTheDocument();
    expect(visual).toHaveClass("partner-solution-visual");
    expect(
      screen.getByRole("img", { name: detail.heroVisual.alt }),
    ).toHaveClass("partner-solution-visual__image");
    expect(visual).not.toHaveClass("border", "rounded-[24px]");
  });

  it("renders confirmed Extreme products without commercial amounts", () => {
    const { container } = renderDetail("/solutions/network/extreme-networks", "zh-CN");
    const cases = container.querySelector("#partner-case-studies");
    const ctaTitle = screen.getByRole("heading", {
      level: 2,
      name: "让网络运营回归简单。",
    });

    expect(ctaTitle).toHaveClass("text-[clamp(2.25rem,5.5vw,5.75rem)]");
    expect(ctaTitle).not.toHaveClass("text-[clamp(3.2rem,7.5vw,8rem)]");

    expect(
      within(cases as HTMLElement).getByText(/49 个 XIQ-PIL-S-C-PWP/),
    ).toBeInTheDocument();
    expect(
      within(cases as HTMLElement).getByText(/AP410C、AP305C/),
    ).toBeInTheDocument();
    expect(cases).not.toHaveTextContent(/84|91|ECS/);
  });

  it("reuses the same customers on both Sangfor solution routes", () => {
    const network = localizePartnerDetail(
      "zh-CN",
      getPartnerDetail("/solutions/network/sangfor"),
    )!;
    const security = localizePartnerDetail(
      "zh-CN",
      getPartnerDetail("/solutions/security/sangfor"),
    )!;

    expect(network.cases.map(({ client }) => client)).toEqual(
      security.cases.map(({ client }) => client),
    );
  });

  it.each(["en", "zh-CN", "fa-IR"] as const)(
    "keeps Palo Alto projects visible in %s",
    (locale) => {
      const detail = localizePartnerDetail(
        locale,
        getPartnerDetail("/solutions/security/palo-alto-networks"),
      )!;

      expect(detail.cases).toHaveLength(3);
      expect(
        detail.cases.every((project) => project.brief && project.scope.length > 0),
      ).toBe(true);
    },
  );

  it("keeps project-free solution pages focused on services", () => {
    const { container } = renderDetail("/solutions/safeguarding/verkada");

    expect(container.querySelector("#partner-case-studies")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Verkada services/i })).toHaveAttribute(
      "href",
      "#partner-services",
    );
  });
});
