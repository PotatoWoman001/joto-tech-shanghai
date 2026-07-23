import { render, screen } from "@testing-library/react";
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

describe("BlogArticlePage", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the requested article in Chinese on the same slug", () => {
    renderApp("/zh/blog/enterprise-network-growth");

    expect(
      screen.getByRole("heading", { level: 1, name: "构建能够随业务增长的企业网络" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/blog/enterprise-network-growth",
    );
    expect(
      screen.getByRole("heading", { name: "问题通常从一个看似很小的需求开始" }),
    ).toBeInTheDocument();
  });

  it("renders an article-not-found state for an unknown slug", () => {
    renderApp("/blog/unknown");

    expect(screen.getByRole("heading", { name: "Article not found." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to insights" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });
});
