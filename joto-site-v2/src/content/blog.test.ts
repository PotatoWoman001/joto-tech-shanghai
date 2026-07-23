import { describe, expect, it } from "vitest";
import { blogArticles, getBlogArticle } from "./blog";

describe("blog content", () => {
  it("publishes six localized articles with stable slugs", () => {
    expect(blogArticles).toHaveLength(6);
    expect(new Set(blogArticles.map(({ slug }) => slug)).size).toBe(6);

    for (const article of blogArticles) {
      expect(article.translations.en.body.length).toBeGreaterThan(3);
      expect(article.translations["zh-CN"].body.length).toBeGreaterThan(3);
      expect(article.translations["fa-IR"].body.length).toBeGreaterThan(3);
    }
  });

  it("finds an article by exact slug", () => {
    expect(getBlogArticle("enterprise-network-growth")?.featured).toBe(true);
    expect(getBlogArticle("missing-article")).toBeUndefined();
  });
});
