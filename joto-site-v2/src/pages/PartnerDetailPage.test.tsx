import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getPartnerDetail } from "../content/partners";
import PartnerDetailPage from "./PartnerDetailPage";

describe("PartnerDetailPage", () => {
  it("renders the complete Cisco × JOTO story from partner data", () => {
    const detail = getPartnerDetail("/solutions/network/cisco");
    expect(detail).toBeDefined();

    const { container } = render(<PartnerDetailPage detail={detail!} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Cisco solutions, delivered by JOTO/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("delivered by JOTO.")).toHaveClass(
      "text-[clamp(2.8rem,6.64vw,6.72rem)]",
    );
    expect(screen.getAllByText("Cisco × JOTO")).toHaveLength(2);
    expect(screen.getByRole("img", { name: detail!.heroVisual.alt })).toBeInTheDocument();

    const services = container.querySelector("#partner-services");
    expect(services).not.toBeNull();
    expect(within(services as HTMLElement).getAllByRole("heading", { level: 3 })).toHaveLength(3);

    const cases = container.querySelector("#partner-case-studies");
    expect(cases).not.toBeNull();
    expect(within(cases as HTMLElement).getAllByRole("article")).toHaveLength(3);

    expect(screen.getByRole("link", { name: /View Cisco case studies/i })).toHaveAttribute(
      "href",
      "#partner-case-studies",
    );
    expect(screen.getByRole("link", { name: /Start a conversation/i })).toHaveAttribute(
      "href",
      "mailto:sales@jototech.cn",
    );
  });
});
