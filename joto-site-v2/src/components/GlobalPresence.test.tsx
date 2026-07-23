import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GlobalPresence from "./GlobalPresence";

describe("GlobalPresence", () => {
  it("presents six animated region nodes linked to the global map", () => {
    const { container } = render(<GlobalPresence />);

    expect(container.querySelector("[data-region-grid]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-region-card]")).toHaveLength(6);
    expect(container.querySelectorAll("[data-region-icon]")).toHaveLength(6);

    fireEvent.mouseEnter(screen.getByRole("button", { name: /Japan.*Tokyo/i }));
    expect(container.querySelector('[data-marker-id="tokyo"]')).toHaveAttribute(
      "data-active",
      "true",
    );
  });
});
