import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("JOTO TECH single-page website", () => {
  it("renders every primary navigation target", () => {
    const { container } = render(<App />);

    for (const id of ["solutions", "services", "case-studies", "about", "contact"]) {
      expect(container.querySelector(`#${id}`)).toBeInTheDocument();
    }
  });

  it("renders the five solution categories without empty detail links", () => {
    const { container } = render(<App />);
    const solutions = container.querySelector("#solutions");
    expect(solutions).not.toBeNull();
    const region = within(solutions as HTMLElement);

    for (const heading of ["Network", "Security", "Server & Storage", "Collaboration", "Safeguarding"]) {
      expect(region.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(region.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(region.queryAllByRole("link")).toHaveLength(0);
    expect(region.getAllByRole("img")).toHaveLength(5);
    expect(region.queryByText("Cisco")).not.toBeInTheDocument();
    expect(container.querySelector("#solution-network-cisco")).toBeInTheDocument();
  });

  it("shows the complete business page with the global delivery map", () => {
    render(<App />);

    expect(document.querySelector("#services h2")).toBeInTheDocument();
    expect(document.querySelector("#case-studies")).toBeInTheDocument();
    expect(document.querySelector("#partners")).not.toBeInTheDocument();
    expect(document.querySelector("#global-presence")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /world map showing JOTO's international delivery footprint/i }),
    ).toBeInTheDocument();
  });

  it("protects long about statistics from overflowing their cards", () => {
    render(<App />);

    expect(screen.getByText("LIFECYCLE")).toHaveClass("break-words");
    expect(screen.getByText("MULTI-VENDOR")).toHaveClass("break-words");
  });

  it("contains none of the excluded legacy product language", () => {
    const { container } = render(<App />);
    const forbidden = [
      ["JOTO", " ", "AI"].join(""),
      ["Di", "fy"].join(""),
      ["AI", "GC"].join(""),
      ["Code", "Nest"].join(""),
    ];

    for (const term of forbidden) {
      expect(container.textContent?.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });
});
