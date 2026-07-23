import { describe, expect, it } from "vitest";
import { partnerDetails } from "../content/partners";
import { localizePartnerDetail } from "./translations";
import { faPartnerProfiles, zhPartnerProfiles } from "./solutionProfiles";

const nonCiscoDetails = partnerDetails.filter((detail) => detail.partnerName !== "Cisco");

describe("localized solution profiles", () => {
  it("covers every non-Cisco public solution route in Chinese and Persian", () => {
    const expectedPaths = nonCiscoDetails.map((detail) => detail.pathname);

    expect(Object.keys(zhPartnerProfiles)).toEqual(expectedPaths);
    expect(Object.keys(faPartnerProfiles)).toEqual(expectedPaths);
  });

  it.each([
    ["zh-CN", /[\u4e00-\u9fff]/],
    ["fa-IR", /[\u0600-\u06ff]/],
  ] as const)("keeps every %s solution page complete and distinct", (locale, scriptPattern) => {
    const localized = nonCiscoDetails.map((detail) => localizePartnerDetail(locale, detail)!);

    expect(new Set(localized.map((detail) => detail.title)).size).toBe(19);
    expect(new Set(localized.map((detail) => detail.accent)).size).toBe(19);
    expect(new Set(localized.map((detail) => detail.introduction)).size).toBe(19);
    expect(new Set(localized.map((detail) => detail.relationshipTitle)).size).toBe(19);
    expect(new Set(localized.flatMap((detail) => detail.services.map((service) => service.title))).size)
      .toBe(57);

    for (const detail of localized) {
      expect(detail.title).toMatch(scriptPattern);
      expect(detail.accent).toMatch(scriptPattern);
      expect(detail.introduction).toMatch(scriptPattern);
      expect(detail.relationshipTitle).toMatch(scriptPattern);
      expect(detail.services).toHaveLength(3);
      expect(detail.services.every((service) => service.title.match(scriptPattern))).toBe(true);
      expect(detail.cases).toEqual([]);
      expect(detail.partnerBadge).toBeTruthy();
    }
  });
});
