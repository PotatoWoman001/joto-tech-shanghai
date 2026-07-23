import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SiteFooter from "./SiteFooter";

describe("SiteFooter", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the reference-inspired four-column footer content", () => {
    const { container } = render(<SiteFooter />);

    expect(container.querySelector("[data-footer-tagline]")).toHaveTextContent(
      "We make IT happen.",
    );
    expect(screen.getByText("IT")).toHaveClass("text-joto-green");
    expect(screen.getByRole("link", { name: "JOTO TECH home" })).toHaveTextContent(/^JOTO$/);
    expect(screen.getByRole("navigation", { name: "Footer solutions" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Footer company" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
    expect(
      screen.getByText("Professional Service · Innovation as Priority · Customer Success First"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "沪ICP备15056478号" })).toHaveAttribute(
      "href",
      "https://beian.miit.gov.cn",
    );
  });

  it("routes home-section links back to the landing page from About", () => {
    window.history.replaceState({}, "", "/about");
    render(<SiteFooter />);

    const solutions = screen.getByRole("navigation", { name: "Footer solutions" });
    const company = screen.getByRole("navigation", { name: "Footer company" });

    expect(within(solutions).getByRole("link", { name: "Network" })).toHaveAttribute(
      "href",
      "/#solution-network",
    );
    expect(within(company).getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/#services",
    );
    expect(within(company).getByRole("link", { name: "Contact Us" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(within(company).getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });
});
