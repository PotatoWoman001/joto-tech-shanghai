import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SolutionCategory } from "../content/types";
import SolutionCard from "./SolutionCard";

const category: SolutionCategory = {
  id: "network",
  title: "Network",
  description:
    "Campus, branch and data-center connectivity designed for consistent performance, visibility and control.",
  image: "/network.jpg",
  imageAlt: "Enterprise network infrastructure",
  vendors: [{ name: "Cisco", description: "Enterprise networking." }],
};

describe("SolutionCard", () => {
  it("renders the solution story and links to the first partner detail", () => {
    const { container } = render(
      <SolutionCard
        category={category}
        index={0}
        learnMoreLabel="Learn more"
        locale="en"
      />,
    );

    expect(screen.getByRole("img", { name: category.imageAlt })).toHaveAttribute(
      "src",
      category.image,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: category.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(category.description)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Learn more: Network" }),
    ).toHaveAttribute("href", "/solutions/network/cisco");
    expect(container.querySelector("[data-solution-card]")).toHaveAttribute(
      "data-solution-card",
      "network",
    );
  });

  it("exposes hover, keyboard and reduced-motion interaction states", () => {
    const { container } = render(
      <SolutionCard
        category={category}
        index={0}
        learnMoreLabel="Learn more"
        locale="en"
      />,
    );
    const card = container.querySelector("[data-solution-card]") as HTMLElement;
    const visual = container.querySelector("[data-solution-visual]") as HTMLElement;
    const description = container.querySelector(
      "[data-solution-description]",
    ) as HTMLElement;
    const action = screen.getByRole("link", { name: "Learn more: Network" });

    expect(card).toHaveClass("group");
    expect(card).toHaveClass("h-[500px]", "sm:h-[540px]", "xl:h-[530px]");
    expect(visual).toHaveClass("xl:h-[440px]");
    expect(visual.className).toContain("xl:group-hover:h-full");
    expect(visual.className).toContain("group-focus-within:h-full");
    expect(visual.className).toContain("motion-reduce:transition-none");
    expect(description.className).toContain("xl:opacity-0");
    expect(description.className).toContain("xl:group-hover:opacity-100");
    expect(action.className).toContain("group-hover:bg-white");
    expect(action.className).toContain("group-hover:text-joto-green");
    expect(action.className).not.toContain("xl:group-hover:bg-white");
    expect(action.className).toContain("focus-visible:outline");
  });
});
