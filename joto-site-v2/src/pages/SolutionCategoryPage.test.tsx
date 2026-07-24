import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getSolutionCategoryDetail } from "../content/solutionCategories";
import { I18nProvider } from "../i18n/I18nProvider";
import SolutionCategoryPage from "./SolutionCategoryPage";

function renderCategory(pathname: string, categoryPath = "/solutions/network") {
  window.history.replaceState({}, "", pathname);
  const locale = pathname.startsWith("/zh")
    ? "zh-CN"
    : pathname.startsWith("/fa")
      ? "fa-IR"
      : "en";
  const detail = getSolutionCategoryDetail(categoryPath, locale);

  return render(
    <I18nProvider>
      <SolutionCategoryPage detail={detail!} />
    </I18nProvider>,
  );
}

describe("SolutionCategoryPage", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the complete Network category and links into partner pages", () => {
    const { container } = renderCategory("/solutions/network");

    expect(screen.getByRole("heading", { level: 1, name: "Network" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-solution-category-page='network']")).toHaveLength(1);
    expect(container.querySelector("[data-solution-partner-grid]")).toHaveClass(
      "lg:grid-cols-4",
    );
    expect(
      screen.getByRole("heading", { name: "High-availability Network Design" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.getByRole("link", { name: /Cisco/ })).toHaveAttribute(
      "href",
      "/solutions/network/cisco",
    );
    expect(screen.queryByText("Harrow International School")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact JOTO/ })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("keeps Chinese page links localized", () => {
    renderCategory("/zh/solutions/network");

    expect(screen.getByText("让业务始终在线的网络底座。")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cisco/ })).toHaveAttribute(
      "href",
      "/zh/solutions/network/cisco",
    );
    expect(screen.getByRole("link", { name: /联系 JOTO/ })).toHaveAttribute(
      "href",
      "/zh/contact",
    );
  });

  it("balances six partners into a three-by-two grid", () => {
    const { container } = renderCategory(
      "/zh/solutions/security",
      "/solutions/security",
    );

    expect(container.querySelectorAll("[data-solution-partner]")).toHaveLength(6);
    expect(container.querySelector("[data-solution-partner-grid]")).toHaveClass(
      "lg:grid-cols-3",
    );
  });
});
