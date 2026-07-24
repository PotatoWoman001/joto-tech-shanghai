import { describe, expect, it } from "vitest";
import {
  getSolutionCategoryDetail,
  getSolutionCategoryPageLabels,
  solutionCategoryPaths,
} from "./solutionCategories";

describe("solution category details", () => {
  it("defines five unique category routes with six capabilities each", () => {
    expect(solutionCategoryPaths).toEqual([
      "/solutions/network",
      "/solutions/security",
      "/solutions/server-storage",
      "/solutions/collaboration",
      "/solutions/safeguarding",
    ]);
    expect(new Set(solutionCategoryPaths).size).toBe(5);

    solutionCategoryPaths.forEach((pathname) => {
      expect(getSolutionCategoryDetail(pathname, "en")?.capabilities).toHaveLength(6);
    });
  });

  it("returns localized category content and normalizes a trailing slash", () => {
    expect(getSolutionCategoryDetail("/solutions/network/", "en")?.tagline).toBe(
      "The backbone your business runs on.",
    );
    expect(getSolutionCategoryDetail("/solutions/network", "zh-CN")?.tagline).toBe(
      "让业务始终在线的网络底座。",
    );
    expect(getSolutionCategoryDetail("/solutions/network", "fa-IR")?.tagline).toContain(
      "کسب‌وکار",
    );
    expect(getSolutionCategoryPageLabels("zh-CN").ctaLabel).toBe("联系 JOTO");
  });

  it("does not treat a partner route as a category route", () => {
    expect(getSolutionCategoryDetail("/solutions/network/cisco", "en")).toBeUndefined();
  });
});
