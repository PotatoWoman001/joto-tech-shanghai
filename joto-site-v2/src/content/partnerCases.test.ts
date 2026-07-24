import { describe, expect, it } from "vitest";
import { getPartnerCases } from "./partnerCases";

const primaryPaths = [
  "/solutions/security/palo-alto-networks",
  "/solutions/security/knowbe4",
  "/solutions/network/extreme-networks",
  "/solutions/security/fortinet",
  "/solutions/network/aruba",
  "/solutions/security/sangfor",
  "/solutions/safeguarding/hikvision",
] as const;

describe("partner representative projects", () => {
  it("contains 15 unique source-backed projects", () => {
    expect(
      primaryPaths.reduce((total, path) => total + getPartnerCases(path, "en").length, 0),
    ).toBe(15);
  });

  it("keeps facts complete in every locale", () => {
    for (const locale of ["en", "zh-CN", "fa-IR"] as const) {
      for (const path of primaryPaths) {
        for (const project of getPartnerCases(path, locale)) {
          expect(project.client).toBeTruthy();
          expect(project.tag).toBeTruthy();
          expect(project.category).toBeTruthy();
          expect(project.brief).toBeTruthy();
          expect(project.scope.length).toBeGreaterThan(0);
          expect(project.scope.every(Boolean)).toBe(true);
        }
      }
    }
  });

  it("preserves confirmed Palo Alto and Extreme facts", () => {
    expect(JSON.stringify(getPartnerCases("/solutions/security/palo-alto-networks", "en")))
      .toContain("PA-5430");
    expect(JSON.stringify(getPartnerCases("/solutions/security/palo-alto-networks", "en")))
      .toContain("2022–2025");
    expect(JSON.stringify(getPartnerCases("/solutions/network/extreme-networks", "zh-CN")))
      .toContain("49 个");
    expect(JSON.stringify(getPartnerCases("/solutions/network/extreme-networks", "en")))
      .toContain("AP410C");
  });

  it("shares Sangfor projects across network and security routes", () => {
    expect(getPartnerCases("/solutions/network/sangfor", "zh-CN")).toEqual(
      getPartnerCases("/solutions/security/sangfor", "zh-CN"),
    );
  });

  it("returns no projects for omitted solutions and normalizes trailing slashes", () => {
    expect(getPartnerCases("/solutions/safeguarding/verkada", "zh-CN")).toEqual([]);
    expect(getPartnerCases("/solutions/server-storage/dell-technologies", "en")).toEqual([]);
    expect(getPartnerCases("/solutions/network/extreme-networks/", "en")).toEqual(
      getPartnerCases("/solutions/network/extreme-networks", "en"),
    );
  });

  it("does not publish internal commercial details or unsupported customers", () => {
    const published = JSON.stringify(
      primaryPaths.flatMap((path) => getPartnerCases(path, "zh-CN")),
    );

    expect(published).not.toMatch(/84|91|ECS|合同库|结构化数据库/);
    expect(published).not.toMatch(/Unite|上海东浙|江苏海德|晶晨半导体（深圳）|上海长锐/);
  });
});
