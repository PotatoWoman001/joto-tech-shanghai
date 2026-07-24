import { describe, expect, it } from "vitest";
import { blogArticles } from "../content/blog";
import { partnerDetails } from "../content/partners";
import { solutionCategoryPaths } from "../content/solutionCategories";
import routes from "./public-routes.json";
import {
  SITE_ORIGIN,
  absolutePublicUrl,
  alternateUrls,
  localizedPublicPath,
} from "./site";

describe("SEO public URLs", () => {
  it("uses jotoglobal.com as the only production origin", () => {
    expect(SITE_ORIGIN).toBe("https://jotoglobal.com");
  });

  it.each([
    ["en", "/", "/"],
    ["zh-CN", "/", "/zh/"],
    ["fa-IR", "/", "/fa/"],
    ["en", "/about/", "/about"],
    ["zh-CN", "/about/", "/zh/about"],
    ["fa-IR", "/about/", "/fa/about"],
  ] as const)("localizes %s %s", (locale, pathname, expected) => {
    expect(localizedPublicPath(pathname, locale)).toBe(expected);
  });

  it("returns canonical and complete alternate URLs", () => {
    expect(absolutePublicUrl("/solutions/network", "zh-CN")).toBe(
      "https://jotoglobal.com/zh/solutions/network",
    );
    expect(alternateUrls("/solutions/network")).toEqual([
      { hreflang: "en", href: "https://jotoglobal.com/solutions/network" },
      { hreflang: "zh-CN", href: "https://jotoglobal.com/zh/solutions/network" },
      { hreflang: "fa-IR", href: "https://jotoglobal.com/fa/solutions/network" },
      { hreflang: "x-default", href: "https://jotoglobal.com/solutions/network" },
    ]);
  });

  it("keeps the route manifest synchronized with content", () => {
    const expected = [
      "/",
      "/about",
      "/contact",
      "/blog",
      ...blogArticles.map(({ slug }) => `/blog/${slug}`),
      ...solutionCategoryPaths,
      ...partnerDetails.map(({ pathname }) => pathname),
    ].sort();

    expect([...routes].sort()).toEqual(expected);
    expect(new Set(routes).size).toBe(routes.length);
  });
});
