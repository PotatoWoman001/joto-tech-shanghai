import { describe, expect, it } from "vitest";
import { buildSeoDescriptor } from "./descriptor";

describe("SEO structured data", () => {
  it("describes the organization, website and home page with stable entities", () => {
    const home = buildSeoDescriptor("zh-CN", "/");

    expect(home.structuredData.map((node) => node["@type"])).toEqual(
      expect.arrayContaining(["Organization", "WebSite", "WebPage"]),
    );
    expect(
      home.structuredData.find((node) => node["@type"] === "Organization"),
    ).toMatchObject({
      "@id": "https://jotoglobal.com/#organization",
      name: "JOTO TECH",
      legalName: "JOTO Tech (SH) Co., Ltd.",
      url: "https://jotoglobal.com/",
      email: "sales@jototech.cn",
      foundingDate: "2010",
    });
    expect(
      home.structuredData.find((node) => node["@type"] === "WebSite"),
    ).toMatchObject({
      "@id": "https://jotoglobal.com/#website",
      url: "https://jotoglobal.com/",
      inLanguage: "zh-CN",
    });
  });

  it("uses the specific schema page type for about and contact pages", () => {
    expect(
      buildSeoDescriptor("en", "/about").structuredData.map(
        (node) => node["@type"],
      ),
    ).toEqual(expect.arrayContaining(["AboutPage", "BreadcrumbList"]));
    expect(
      buildSeoDescriptor("fa-IR", "/contact").structuredData.map(
        (node) => node["@type"],
      ),
    ).toEqual(expect.arrayContaining(["ContactPage", "BreadcrumbList"]));
  });

  it("uses existing article content and never invents a modification date", () => {
    const article = buildSeoDescriptor(
      "en",
      "/blog/enterprise-network-growth",
    );

    expect(article.structuredData.map((node) => node["@type"])).toEqual(
      expect.arrayContaining(["Article", "BreadcrumbList"]),
    );
    const articleNode = article.structuredData.find(
      (node) => node["@type"] === "Article",
    );
    expect(articleNode).toMatchObject({
      headline:
        "Building an Enterprise Network That Can Grow With the Business",
      datePublished: "2026-07-22",
      inLanguage: "en",
    });
    expect(articleNode).not.toHaveProperty("dateModified");
  });

  it("creates serializable nodes only for public pages", () => {
    const publicDescriptors = [
      buildSeoDescriptor("zh-CN", "/"),
      buildSeoDescriptor("en", "/about"),
      buildSeoDescriptor("fa-IR", "/contact"),
      buildSeoDescriptor("en", "/blog/enterprise-network-growth"),
      buildSeoDescriptor("zh-CN", "/solutions/network"),
      buildSeoDescriptor("zh-CN", "/solutions/network/cisco"),
    ];

    for (const { structuredData } of publicDescriptors) {
      expect(() => JSON.stringify(structuredData)).not.toThrow();
      expect(structuredData.length).toBeGreaterThan(0);
    }

    expect(
      buildSeoDescriptor("zh-CN", "/preview/customer-logo-wall")
        .structuredData,
    ).toEqual([]);
    expect(
      buildSeoDescriptor("zh-CN", "/this-route-does-not-exist")
        .structuredData,
    ).toEqual([]);
  });
});
