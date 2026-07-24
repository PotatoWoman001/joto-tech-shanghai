import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Services from "./Services";

describe("Services", () => {
  it("presents the six approved services as a homepage destination", () => {
    const { container } = render(<Services />);
    const section = container.querySelector("#services") as HTMLElement;
    const region = within(section);

    expect(section).toBeInTheDocument();
    expect(region.getByText("END-TO-END SERVICES")).toBeInTheDocument();
    expect(
      region.getByRole("heading", {
        level: 2,
        name: "From the first workshop to steady-state operations.",
      }),
    ).toBeInTheDocument();
    expect(
      region.getByText(
        "JOTO brings planning, integration and ongoing service together so multi-vendor environments remain coherent throughout their lifecycle.",
      ),
    ).toBeInTheDocument();

    expect(
      region.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual([
      "IT Planning & Consulting",
      "Design & Deployment",
      "IT Procurement",
      "Managed Outsourcing & Staffing",
      "Managed Security Services",
      "24×7 Support & Maintenance",
    ]);
    expect(section.querySelectorAll("[data-service-card]")).toHaveLength(6);
    expect(section.querySelectorAll("[data-service-icon]")).toHaveLength(6);
    expect(section.querySelector("[data-services-grid]")).not.toHaveClass("border");
    section.querySelectorAll("[data-service-card]").forEach((card) => {
      expect(card).toHaveClass("text-center");
    });
    expect(region.queryAllByRole("img")).toHaveLength(0);
    expect(region.queryAllByRole("link")).toHaveLength(0);
  });
});
