import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getPartnerDetail } from "../content/partners";
import { I18nProvider } from "../i18n/I18nProvider";
import PartnerDetailPage from "./PartnerDetailPage";

function renderDetail(pathname: string) {
  const detail = getPartnerDetail(pathname);
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
      "text-[clamp(2.8rem,6.64vw,6.72rem)]",
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
    expect(screen.getByRole("img", { name: detail!.heroVisual.alt })).toBeInTheDocument();
    expect(container.querySelector("[data-cisco-network-topology]")).toBeInTheDocument();
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
    expect(customerLogoWall?.querySelectorAll("[data-logo-sequence]")).toHaveLength(4);
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
    expect(chewyLogo).toHaveAttribute("data-logo-treatment", "brand");
    expect(chewyLogo).not.toHaveClass("brightness-0");
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
    const { container } = renderDetail("/solutions/security/palo-alto-networks");

    expect(
      screen.getByRole("heading", { level: 1, name: /Palo Alto Networks solutions/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Palo Alto Networks × JOTO")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Explore Palo Alto Networks use cases/i })).toHaveAttribute(
      "href",
      "#partner-case-studies",
    );
    expect(container.querySelector("[data-network-telemetry]")).not.toBeInTheDocument();
    expect(screen.queryByText(/Cisco infrastructure, proven in the field/i)).not.toBeInTheDocument();
  });
});
