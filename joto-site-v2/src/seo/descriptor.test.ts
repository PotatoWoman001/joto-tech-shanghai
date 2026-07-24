import { describe, expect, it } from "vitest";
import { locales } from "../i18n/routing";
import { buildSeoDescriptor } from "./descriptor";
import { PUBLIC_ROUTES } from "./site";

describe("page SEO descriptors", () => {
  it("prioritizes Chinese enterprise IT intent on the home page", () => {
    const seo = buildSeoDescriptor("zh-CN", "/");

    expect(seo.title).toBe("企业 IT 解决方案与系统集成服务 | JOTO TECH");
    expect(seo.description).toContain("企业网络、网络安全、服务器与存储");
    expect(seo.canonicalUrl).toBe("https://jotoglobal.com/zh/");
    expect(seo.robots).toBe("index, follow");
    expect(seo.openGraph.image).toBe("https://jotoglobal.com/og.png");
    expect(seo.openGraph.imageWidth).toBe(1734);
    expect(seo.openGraph.imageHeight).toBe(907);
  });

  it("uses article content for localized article metadata", () => {
    const seo = buildSeoDescriptor(
      "zh-CN",
      "/blog/enterprise-network-growth",
    );

    expect(seo.title).toBe("构建能够随业务增长的企业网络 | JOTO TECH");
    expect(seo.description).toBe(
      "可靠的网络应从业务优先级、站点现实和运维责任出发，而不是从设备清单出发。",
    );
    expect(seo.openGraph.type).toBe("article");
  });

  it("uses localized category content for solution metadata", () => {
    const seo = buildSeoDescriptor("zh-CN", "/solutions/network");

    expect(seo.title).toBe("网络解决方案、系统集成与运维 | JOTO TECH");
    expect(seo.description).toContain("高可用架构");
    expect(seo.canonicalUrl).toBe(
      "https://jotoglobal.com/zh/solutions/network",
    );
  });

  it("combines partner brand, solution and JOTO delivery", () => {
    const seo = buildSeoDescriptor("zh-CN", "/solutions/network/cisco");

    expect(seo.title).toBe(
      "Cisco 企业网络解决方案、部署与运维 | JOTO TECH",
    );
    expect(seo.description).toContain("Cisco");
    expect(seo.description).toContain("规划、部署");
  });

  it("uses the localized partner profile rather than English source copy", () => {
    const seo = buildSeoDescriptor("zh-CN", "/solutions/network/aruba");

    expect(seo.description).toContain("Aruba Central");
    expect(seo.description).toContain("统一接入");
    expect(seo.description).not.toContain("JOTO combines");
  });

  it("marks preview and unknown paths as non-indexable", () => {
    const preview = buildSeoDescriptor("en", "/preview/customer-logo-wall");
    expect(preview.robots).toBe("noindex, nofollow");
    expect(preview.canonicalUrl).toBeUndefined();
    expect(preview.alternates).toEqual([]);

    const missing = buildSeoDescriptor("fa-IR", "/missing");
    expect(missing.status).toBe("not-found");
    expect(missing.canonicalUrl).toBeUndefined();
    expect(missing.alternates).toEqual([]);
  });

  it.each(locales)(
    "recognizes every public route in the %s locale",
    (locale) => {
      for (const pathname of PUBLIC_ROUTES) {
        const seo = buildSeoDescriptor(locale, pathname);

        expect(seo.status, pathname).toBe("public");
        expect(seo.robots, pathname).toBe("index, follow");
        expect(seo.canonicalUrl, pathname).toBeDefined();
        expect(seo.alternates, pathname).toHaveLength(4);
      }
    },
  );
});
