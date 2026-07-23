import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getPartnerDetail } from "../content/partners";
import PartnerDetailPage from "./PartnerDetailPage";

function renderDetail(pathname: string) {
  const detail = getPartnerDetail(pathname);
  expect(detail).toBeDefined();

  return {
    detail: detail!,
    ...render(<PartnerDetailPage detail={detail!} />),
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
    expect(screen.getAllByText("Cisco × JOTO")).toHaveLength(1);
    expect(screen.getByRole("img", { name: "Cisco logo" })).toHaveClass(
      "max-h-8",
      "max-w-[140px]",
    );
    expect(screen.getByRole("img", { name: detail!.heroVisual.alt })).toBeInTheDocument();

    const services = container.querySelector("#partner-services");
    expect(services).not.toBeNull();
    expect(within(services as HTMLElement).getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(within(services as HTMLElement).getAllByRole("img")).toHaveLength(3);
    for (const service of detail!.services) {
      expect(
        within(services as HTMLElement).getByRole("img", { name: service.imageAlt }),
      ).toBeInTheDocument();
      expect(
        within(services as HTMLElement).getByLabelText(`${service.title} icon`),
      ).toBeInTheDocument();
    }

    const cases = container.querySelector("#partner-case-studies");
    expect(cases).not.toBeNull();
    expect(within(cases as HTMLElement).getAllByRole("article")).toHaveLength(3);

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
    renderDetail("/solutions/security/palo-alto-networks");

    expect(
      screen.getByRole("heading", { level: 1, name: /Palo Alto Networks solutions/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Palo Alto Networks × JOTO")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Explore Palo Alto Networks use cases/i })).toHaveAttribute(
      "href",
      "#partner-case-studies",
    );
    expect(screen.queryByText(/Cisco infrastructure, proven in the field/i)).not.toBeInTheDocument();
  });
});
