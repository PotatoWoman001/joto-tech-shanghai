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
      "24×7 Support & Maintenance",
      "Managed Security Services",
      "Managed Outsourcing & Staffing",
      "IT Procurement",
    ]);
    expect(section.querySelectorAll("[data-service-card]")).toHaveLength(6);
    expect(section.querySelectorAll("[data-service-icon]")).toHaveLength(6);
    expect(region.getAllByRole("img")).toHaveLength(6);
    expect(
      region.getByRole("img", {
        name: "Security operator monitoring multiple live systems in a control center",
      }),
    ).toBeInTheDocument();
    expect(region.queryAllByRole("link")).toHaveLength(0);
  });
});
