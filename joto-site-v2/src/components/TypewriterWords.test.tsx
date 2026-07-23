import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TypewriterWords from "./TypewriterWords";

describe("TypewriterWords", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("types, holds, deletes and advances to the next word", () => {
    vi.useFakeTimers();
    const { container } = render(
      <TypewriterWords
        deletingDelay={5}
        holdDelay={20}
        typingDelay={10}
        words={["IT", "Go"]}
      />,
    );
    const animatedLayer = container.querySelector(".col-start-1.row-start-1:not(.invisible)");

    act(() => vi.advanceTimersByTime(10));
    expect(animatedLayer).toHaveTextContent("I");

    act(() => vi.advanceTimersByTime(10));
    expect(animatedLayer).toHaveTextContent("IT");

    act(() => vi.advanceTimersByTime(20));
    act(() => vi.advanceTimersByTime(5));
    expect(animatedLayer).toHaveTextContent("I");

    act(() => vi.advanceTimersByTime(5));
    expect(animatedLayer).not.toHaveTextContent("IT");

    act(() => vi.advanceTimersByTime(5));
    act(() => vi.advanceTimersByTime(10));
    expect(animatedLayer).toHaveTextContent("G");
  });

  it("shows the first word without a cursor when reduced motion is requested", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      () =>
        ({
          matches: true,
          media: "(prefers-reduced-motion: reduce)",
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    const { container } = render(<TypewriterWords words={["IT", "Connections"]} />);

    expect(screen.getAllByText("IT")).toHaveLength(1);
    expect(container.querySelector(".hero-type-cursor")).not.toBeInTheDocument();
  });
});
