import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CustomerLogoWall from "./CustomerLogoWall";

describe("CustomerLogoWall", () => {
  it("exposes one accessible image per unique customer and hides loop copies", () => {
    const { container } = render(<CustomerLogoWall />);

    expect(
      screen.getByRole("heading", { level: 2, name: "TRUSTED BY INDUSTRY LEADERS" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(42);
    expect(container.querySelectorAll('[data-logo-sequence="duplicate"]')).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-logo-sequence="duplicate"][aria-hidden="true"]'),
    ).toHaveLength(2);
  });

  it("shows the brand name when an image fails", () => {
    render(<CustomerLogoWall />);
    fireEvent.error(screen.getByRole("img", { name: "McDonald’s logo" }));

    expect(screen.getByText("McDonald’s")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "McDonald’s logo" })).not.toBeInTheDocument();
  });

  it("marks the second row for reverse motion", () => {
    const { container } = render(<CustomerLogoWall />);
    const tracks = container.querySelectorAll(".customer-logo-wall__track");

    expect(tracks).toHaveLength(2);
    expect(tracks[0]).not.toHaveClass("customer-logo-wall__track--reverse");
    expect(tracks[1]).toHaveClass("customer-logo-wall__track--reverse");
  });
});
