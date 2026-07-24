import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteContent } from "../content/en";
import Partners from "./Partners";

describe("Partners", () => {
  it("renders a compact logo-only wall in the approved priority order", () => {
    const { container } = render(<Partners />);

    expect(container.querySelectorAll("[data-partner-logo-card]")).toHaveLength(20);
    expect(container.querySelector("[data-partner-logo-grid]")).toHaveClass(
      "grid-cols-3",
      "lg:grid-cols-4",
      "xl:grid-cols-5",
    );
    expect(
      screen
        .getAllByRole("img")
        .slice(0, 8)
        .map((image) => image.getAttribute("alt")),
    ).toEqual([
      "Cisco logo",
      "Extreme Networks logo",
      "Sangfor 深信服 logo",
      "Fortinet logo",
      "Palo Alto Networks logo",
      "KnowBe4 logo",
      "Verkada logo",
      "Hikvision logo",
    ]);
    const partnerLogos = screen.getAllByRole("img");
    expect(partnerLogos[partnerLogos.length - 1]).toHaveAccessibleName("AppDynamics logo");
    expect(screen.queryByText("Gold Partner")).not.toBeInTheDocument();
    expect(screen.queryByText("Platinum Partner")).not.toBeInTheDocument();
    expect(screen.queryByText(siteContent.partners.items[0].description)).not.toBeInTheDocument();
  });

  it("falls back to the brand name when artwork fails", () => {
    render(<Partners />);

    fireEvent.error(screen.getByRole("img", { name: "Cisco logo" }));

    expect(screen.getByText("Cisco")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Cisco logo" })).not.toBeInTheDocument();
  });
});
