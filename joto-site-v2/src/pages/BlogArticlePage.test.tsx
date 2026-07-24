import { fireEvent, render, screen, within } from "@testing-library/react";
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
    fireEvent.click(screen.getByRole("button", { name: "中文 — 语言选择" }));
    expect(within(screen.getByRole("menu")).getByRole("menuitem", { name: "EN" })).toHaveAttribute(
      "href",
      "/blog/enterprise-network-growth",
    );
    expect(
      screen.getByRole("heading", { name: "问题通常从一个看似很小的需求开始" }),
    ).toBeInTheDocument();
  });

  it("renders the Chinese closing viewpoint as compact sans-serif content", () => {
    const { container } = renderApp("/zh/blog/enterprise-network-growth");
    const closingViewpoint = container.querySelector(
      "[data-article-closing-viewpoint]",
    );
    const closingQuote = closingViewpoint?.querySelector("blockquote");

    expect(screen.getByText("JOTO 观点 · 文章结语")).toBeInTheDocument();
    expect(closingViewpoint).toBeInTheDocument();
    expect(closingQuote).toHaveClass("border-s-2", "font-sans", "not-italic");
    expect(closingQuote).not.toHaveClass(
      "border-y",
      "font-serif",
      "italic",
      "text-joto-green",
    );
    expect(closingQuote).toHaveTextContent(
      "真正可扩展的网络，是在新站点、新用户和新服务加入后，仍然清晰、可控、可维护的网络。",
    );
    expect(closingQuote).not.toHaveTextContent("“");
    expect(closingQuote).not.toHaveTextContent("”");
  });

  it("localizes the closing viewpoint label in English", () => {
    renderApp("/blog/enterprise-network-growth");

    expect(screen.getByText("JOTO VIEWPOINT · CLOSING NOTE")).toBeInTheDocument();
  });

  it("localizes the closing viewpoint label and direction in Persian", () => {
    renderApp("/fa/blog/enterprise-network-growth");

    expect(screen.getByText("دیدگاه جوتو · جمع‌بندی")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
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
