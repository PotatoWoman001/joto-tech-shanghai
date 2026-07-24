import { describe, expect, it } from "vitest";
import {
  detectLocaleFromLanguages,
  explicitLocaleFromPath,
  localeSwitchHref,
  localizedHref,
  parseLocalizedPath,
  prependBasePath,
  stripBasePath,
} from "./routing";

describe("localized routing", () => {
  it("parses locale prefixes while preserving the logical page", () => {
    expect(parseLocalizedPath("/")).toEqual({ locale: "en", pathname: "/" });
    expect(parseLocalizedPath("/zh/about")).toEqual({ locale: "zh-CN", pathname: "/about" });
    expect(parseLocalizedPath("/fa/solutions/network/cisco")).toEqual({
      locale: "fa-IR",
      pathname: "/solutions/network/cisco",
    });
  });

  it("generates stable localized links", () => {
    expect(localizedHref("/contact", "zh-CN")).toBe("/zh/contact");
    expect(localizedHref("/contact", "fa-IR")).toBe("/fa/contact");
    expect(localizedHref("/contact", "en")).toBe("/contact");
    expect(localizedHref("/fa#top", "fa-IR")).toBe("/fa/#top");
    expect(localizedHref("/zh/about", "zh-CN")).toBe("/zh/about");
    expect(localeSwitchHref("fa-IR", "/zh/about", "#top")).toBe("/fa/about#top");
  });

  it("normalizes repository subpaths used by GitHub Pages", () => {
    expect(
      stripBasePath(
        "/joto-tech-shanghai/zh/blog/enterprise-network-growth",
        "/joto-tech-shanghai/",
      ),
    ).toBe("/zh/blog/enterprise-network-growth");
    expect(prependBasePath("/contact", "/joto-tech-shanghai/")).toBe(
      "/joto-tech-shanghai/contact",
    );
  });

  it("detects a first-visit locale from browser language preferences", () => {
    expect(detectLocaleFromLanguages(["zh-CN", "en-US"])).toBe("zh-CN");
    expect(detectLocaleFromLanguages(["fa-IR", "en-US"])).toBe("fa-IR");
    expect(detectLocaleFromLanguages(["fr-FR", "en-US"])).toBe("en");
  });

  it("recognizes only explicit localized route prefixes", () => {
    expect(explicitLocaleFromPath("/zh/blog")).toBe("zh-CN");
    expect(explicitLocaleFromPath("/fa/contact")).toBe("fa-IR");
    expect(explicitLocaleFromPath("/blog")).toBeNull();
  });
});
