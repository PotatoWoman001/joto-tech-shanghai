import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GlobalMap from "./GlobalMap";

describe("GlobalMap", () => {
  it("renders accurate, inspectable city and cluster markers", () => {
    const { container } = render(<GlobalMap />);

    expect(container.querySelectorAll("[data-marker-id]")).toHaveLength(9);
    expect(
      screen.getByRole("button", {
        name: "Yangtze River Delta: Shanghai and Suzhou, China",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Greater Bay Area: Shenzhen and Hong Kong, China",
      }),
    ).toBeInTheDocument();
    const london = screen.getByRole("button", { name: "London, United Kingdom" });
    expect(Number.parseFloat(london.style.left)).toBeCloseTo(46.165, 2);
    expect(Number.parseFloat(london.style.top)).toBeCloseTo(31.821, 2);
  });

  it("reports the active region and highlights all of its markers", () => {
    const onActiveRegionChange = vi.fn();
    const { container, rerender } = render(
      <GlobalMap activeRegion="China" onActiveRegionChange={onActiveRegionChange} />,
    );

    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(3);
    const tokyo = screen.getByRole("button", { name: "Tokyo, Japan" });
    fireEvent.mouseEnter(tokyo);
    expect(onActiveRegionChange).toHaveBeenLastCalledWith("Japan");

    rerender(<GlobalMap activeRegion="Japan" onActiveRegionChange={onActiveRegionChange} />);
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(1);
  });

  it("moves the unified map canvas subtly with a desktop pointer", () => {
    const { container } = render(<GlobalMap />);
    const map = container.querySelector(".global-map") as HTMLElement;
    const canvas = container.querySelector(".global-map__canvas") as HTMLElement;
    vi.spyOn(map, "getBoundingClientRect").mockReturnValue({
      bottom: 100,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const pointerMove = new MouseEvent("pointermove", {
      bubbles: true,
      clientX: 100,
      clientY: 0,
    });
    Object.defineProperty(pointerMove, "pointerType", { value: "mouse" });
    fireEvent(map, pointerMove);
    expect(canvas.style.transform).toContain("translate3d(3.5px, -2.5px, 0)");

    fireEvent.pointerLeave(map);
    expect(canvas.style.transform).toContain("translate3d(0px, 0px, 0)");
  });
});
