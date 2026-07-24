import { afterEach, describe, expect, it } from "vitest";
import {
  initBaiduAnalytics,
  resetBaiduAnalyticsForTests,
  trackContactConversion,
  trackPageView,
} from "./baidu";

describe("baidu analytics", () => {
  afterEach(() => {
    document.getElementById("baidu-hm")?.remove();
    delete window._hmt;
    resetBaiduAnalyticsForTests();
  });

  it("does nothing when no tracking id is configured", () => {
    expect(initBaiduAnalytics("", document)).toBe(false);
    expect(document.getElementById("baidu-hm")).toBeNull();
    trackPageView("/contact");
    expect(window._hmt).toBeUndefined();
  });

  it("loads one async script and disables automatic pageviews", () => {
    expect(initBaiduAnalytics("tracking-123", document)).toBe(true);
    expect(initBaiduAnalytics("tracking-123", document)).toBe(true);
    const scripts = document.querySelectorAll("#baidu-hm");
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toHaveAttribute("src", "https://hm.baidu.com/hm.js?tracking-123");
    expect(window._hmt).toContainEqual(["_setAutoPageview", false]);
  });

  it("deduplicates pageviews and records contact conversion", () => {
    initBaiduAnalytics("tracking-123", document);
    trackPageView("/zh/contact");
    trackPageView("/zh/contact");
    trackContactConversion();

    expect(window._hmt).toContainEqual(["_trackPageview", "/zh/contact"]);
    expect(
      window._hmt?.filter(
        (entry) => entry[0] === "_trackPageview" && entry[1] === "/zh/contact",
      ),
    ).toHaveLength(1);
    expect(window._hmt).toContainEqual(["_trackPageview", "/poc-submitted"]);
    expect(window._hmt).toContainEqual(["_trackEvent", "转化", "表单提交", "jotoglobal"]);
  });
});
