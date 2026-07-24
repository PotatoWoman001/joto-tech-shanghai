import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { I18nProvider } from "../i18n/I18nProvider";

function renderApp(pathname: string) {
  window.history.replaceState({}, "", pathname);
  return render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
}

describe("BlogPage", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders a compact index with all six articles", () => {
    renderApp("/blog");

    expect(
      screen.getByRole("heading", { level: 1, name: "Enterprise insights." }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(
      screen.getByRole("link", {
        name: /Building an Enterprise Network That Can Grow With the Business/,
      }),
    ).toHaveAttribute("href", "/blog/enterprise-network-growth");
  });

  it("renders the localized index under the Chinese route", () => {
    renderApp("/zh/blog");

    expect(
      screen.getByRole("heading", { level: 1, name: "企业实践洞察。" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /构建能够随业务增长的企业网络/ })).toHaveAttribute(
      "href",
      "/zh/blog/enterprise-network-growth",
    );
  });

  it("renders the shared site navigation on the localized Blog index", () => {
    renderApp("/zh/blog");

    const primaryNavigation = screen.getByRole("navigation", { name: "主导航" });
    const siteHeader = primaryNavigation.closest("header");

    expect(primaryNavigation).toBeInTheDocument();
    expect(siteHeader).not.toBeNull();
    expect(within(siteHeader!).getByRole("link", { name: "JOTO TECH home" })).toHaveAttribute(
      "href",
      "/zh/#top",
    );
  });
});
