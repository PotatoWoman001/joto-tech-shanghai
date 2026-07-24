import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { I18nProvider } from "../i18n/I18nProvider";

function renderPath(pathname: string) {
  window.history.replaceState({}, "", pathname);
  return render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
}

afterEach(() => {
  window.history.replaceState({}, "", "/");
  window.localStorage.clear();
  document.head
    .querySelectorAll("[data-joto-seo]")
    .forEach((element) => element.remove());
  document.title = "";
});

describe("NotFoundPage", () => {
  it.each([
    {
      pathname: "/not-a-page",
      title: "Page not found.",
      description: "The page may have moved or the address may be incomplete.",
      links: [
        ["Home", "/"],
        ["Solutions", "/#solutions"],
        ["Latest insights", "/blog"],
        ["Contact us", "/contact"],
      ],
    },
    {
      pathname: "/zh/not-a-page",
      title: "页面未找到。",
      description: "页面可能已移动，或当前地址不完整。",
      links: [
        ["首页", "/zh/"],
        ["解决方案", "/zh/#solutions"],
        ["最新资讯", "/zh/blog"],
        ["联系我们", "/zh/contact"],
      ],
    },
    {
      pathname: "/fa/not-a-page",
      title: "صفحه پیدا نشد.",
      description: "ممکن است صفحه جابه‌جا شده باشد یا نشانی کامل نباشد.",
      links: [
        ["صفحه اصلی", "/fa/"],
        ["راهکارها", "/fa/#solutions"],
        ["تازه‌ترین دیدگاه‌ها", "/fa/blog"],
        ["تماس با ما", "/fa/contact"],
      ],
    },
  ])(
    "renders localized recovery links for $pathname",
    ({ pathname, title, description, links }) => {
      const { container } = renderPath(pathname);

      expect(screen.getByText("JOTO TECH / 404")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
      expect(screen.getByText(description)).toBeInTheDocument();

      const recoveryLinks = within(
        container.querySelector("[data-not-found-links]") as HTMLElement,
      ).getAllByRole("link");

      expect(recoveryLinks).toHaveLength(4);
      links.forEach(([name, href], index) => {
        expect(recoveryLinks[index]).toHaveAccessibleName(name);
        expect(recoveryLinks[index]).toHaveAttribute("href", href);
      });

      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
      expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    },
  );

  it("uses the site-wide 404 for an invalid blog slug", () => {
    const { container } = renderPath("/zh/blog/not-a-real-article");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "页面未找到。",
    );
    expect(container.querySelector("[data-not-found-links]")).toBeInTheDocument();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
});
