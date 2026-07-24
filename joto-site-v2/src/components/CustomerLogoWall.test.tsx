import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CustomerLogoWall from "./CustomerLogoWall";

describe("CustomerLogoWall", () => {
  it("renders all 42 unique logos in one accessible sequence", () => {
    const { container } = render(<CustomerLogoWall />);

    expect(
      screen.getByRole("heading", { level: 2, name: "TRUSTED BY INDUSTRY LEADERS" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(42);
    expect(container.querySelectorAll(".customer-logo-wall__track")).toHaveLength(1);
    expect(container.querySelectorAll('[data-logo-sequence="primary"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-logo-sequence="duplicate"]')).toHaveLength(1);
    expect(
      container.querySelector('[data-logo-sequence="duplicate"]'),
    ).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".customer-logo-wall__track--reverse")).toBeNull();
    expect(screen.getByRole("img", { name: "Bosch logo" })).toHaveAttribute(
      "data-logo-scale",
      "standard",
    );
    expect(screen.getByRole("img", { name: "IMG Academy logo" })).toHaveAttribute(
      "data-logo-scale",
      "prominent",
    );
    expect(screen.getByRole("img", { name: "Haday logo" })).toHaveAttribute(
      "data-logo-scale",
      "compact",
    );
    expect(container.querySelector(".customer-logo-wall__name")).not.toBeInTheDocument();
    expect(screen.queryByText("FORVIA")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "FORVIA logo" })).toHaveAttribute(
      "data-logo-treatment",
      "solid",
    );
  });

  it("shows the brand name only when an image fails", () => {
    render(<CustomerLogoWall />);
    fireEvent.error(screen.getByRole("img", { name: "McDonald’s logo" }));

    expect(screen.getByText("McDonald’s")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "McDonald’s logo" })).not.toBeInTheDocument();
  });

  it("does not render individual logo cards", () => {
    const { container } = render(<CustomerLogoWall />);

    for (const item of container.querySelectorAll("[data-customer-logo-item]")) {
      expect(item.className).not.toMatch(/bg-\[#f4f6f5\]|rounded-lg|shadow-/);
    }
  });

  it("renders one transparent Frontify-style marquee without a ribbon frame", () => {
    const { container } = render(<CustomerLogoWall />);

    expect(container.querySelector("[data-logo-marquee]")).toBeInTheDocument();
    expect(container.querySelectorAll(".customer-logo-wall__viewport")).toHaveLength(1);
    expect(container.querySelector(".customer-logo-wall__ribbon")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".customer-logo-wall__logo")).toHaveLength(84);
  });
});
