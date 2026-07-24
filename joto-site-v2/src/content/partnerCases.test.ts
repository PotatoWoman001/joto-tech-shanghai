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

  it("uses verified local logos and keeps only unverified clients as text fallbacks", () => {
    const projects = primaryPaths.flatMap((path) => getPartnerCases(path, "en"));
    const withoutLogo = projects.filter(({ logo }) => !logo).map(({ client }) => client);

    expect(withoutLogo).toEqual(["Jinnet", "Quasar Medical"]);
    expect(projects.filter(({ logo }) => logo)).toHaveLength(13);
    expect(projects.every(({ logoTreatment }) => logoTreatment !== "brand")).toBe(true);
  });

  it("reuses shared brand assets and keeps logo references identical across locales", () => {
    const sangfor = getPartnerCases("/solutions/network/sangfor", "en");
    const hikvision = getPartnerCases("/solutions/safeguarding/hikvision", "en");
    const fortinet = getPartnerCases("/solutions/security/fortinet", "en");

    expect(sangfor[0].logo).toBe(sangfor[1].logo);
    expect(hikvision[0].logo).toBe(sangfor[0].logo);
    expect(hikvision[1].logo).toBe(fortinet[0].logo);

    for (const path of primaryPaths) {
      expect(getPartnerCases(path, "zh-CN").map(({ logo }) => logo)).toEqual(
        getPartnerCases(path, "en").map(({ logo }) => logo),
      );
      expect(getPartnerCases(path, "fa-IR").map(({ logo }) => logo)).toEqual(
        getPartnerCases(path, "en").map(({ logo }) => logo),
      );
    }
  });

  it("preserves confirmed Palo Alto and Extreme facts", () => {
    const paloAltoProjects = getPartnerCases(
      "/solutions/security/palo-alto-networks",
      "en",
    );

    expect(JSON.stringify(paloAltoProjects)).toContain("PA-5430");
    expect(JSON.stringify(paloAltoProjects)).toContain("2022–2025");
    expect(paloAltoProjects[0].logoTreatment).toBeUndefined();
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
