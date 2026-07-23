import { describe, expect, it } from "vitest";
import { localeSwitchHref, localizedHref, parseLocalizedPath } from "./routing";

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
    expect(localizedHref("/fa#top", "fa-IR")).toBe("/fa#top");
    expect(localizedHref("/zh/about", "zh-CN")).toBe("/zh/about");
    expect(localeSwitchHref("fa-IR", "/zh/about", "#top")).toBe("/fa/about#top");
  });
});
