import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { buildSeoDescriptor } from "./descriptor";
import SeoHead from "./SeoHead";

afterEach(() => {
  document.head.querySelectorAll("[data-joto-seo]").forEach((element) => element.remove());
  document.title = "";
});

describe("SeoHead", () => {
  it("renders complete public metadata and removes public-only tags on route changes", () => {
    const publicSeo = buildSeoDescriptor("zh-CN", "/");
    const previewSeo = buildSeoDescriptor("zh-CN", "/preview/customer-logo-wall");
    const { rerender } = render(<SeoHead descriptor={publicSeo} />);

    expect(document.title).toBe(publicSeo.title);
    expect(document.head.querySelector('meta[name="description"][data-joto-seo]')).toHaveAttribute(
      "content",
      publicSeo.description,
    );
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      publicSeo.canonicalUrl,
    );
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(4);
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute(
      "content",
      publicSeo.canonicalUrl,
    );
    expect(document.head.querySelector('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "JOTO TECH",
    );
    expect(document.head.querySelector('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      String(publicSeo.openGraph.imageWidth),
    );
    expect(document.head.querySelector('meta[property="og:image:height"]')).toHaveAttribute(
      "content",
      String(publicSeo.openGraph.imageHeight),
    );
    expect(document.head.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    const jsonLd = document.head.querySelector(
      'script[type="application/ld+json"][data-joto-seo]',
    );
    expect(jsonLd).not.toBeNull();
    expect(JSON.parse(jsonLd?.textContent ?? "")).toEqual({
      "@context": "https://schema.org",
      "@graph": publicSeo.structuredData,
    });

    rerender(<SeoHead descriptor={previewSeo} />);

    expect(document.title).toBe(previewSeo.title);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(0);
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
    expect(
      document.head.querySelector('script[type="application/ld+json"]'),
    ).toBeNull();
  });

  it("cleans up every managed tag when unmounted", () => {
    const { unmount } = render(
      <SeoHead descriptor={buildSeoDescriptor("fa-IR", "/about")} />,
    );

    expect(document.head.querySelectorAll("[data-joto-seo]").length).toBeGreaterThan(0);

    unmount();

    expect(document.head.querySelectorAll("[data-joto-seo]")).toHaveLength(0);
  });
});
