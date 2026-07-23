import { describe, expect, it } from "vitest";
import { getPartnerDetail, partnerDetails } from "./partners";

const expectedPaths = [
  "/solutions/network/cisco",
  "/solutions/network/extreme-networks",
  "/solutions/network/aruba",
  "/solutions/network/sangfor",
  "/solutions/security/knowbe4",
  "/solutions/security/palo-alto-networks",
  "/solutions/security/fortinet",
  "/solutions/security/sangfor",
  "/solutions/security/check-point",
  "/solutions/security/onelogin",
  "/solutions/server-storage/dell-technologies",
  "/solutions/server-storage/huawei",
  "/solutions/server-storage/inspur",
  "/solutions/collaboration/audiocodes",
  "/solutions/collaboration/vodia",
  "/solutions/collaboration/cyberdata",
  "/solutions/collaboration/informacast",
  "/solutions/safeguarding/verkada",
  "/solutions/safeguarding/hikvision",
  "/solutions/safeguarding/keyking",
];

describe("partner detail content", () => {
  it("returns the complete Cisco detail for its public pathname", () => {
    const detail = getPartnerDetail("/solutions/network/cisco");

    expect(detail?.partnerName).toBe("Cisco");
    expect(detail?.services).toHaveLength(3);
    expect(detail?.services.map((service) => service.icon)).toEqual([
      "compass",
      "wrench",
      "headphones",
    ]);
    for (const service of detail?.services ?? []) {
      expect(service.image).toMatch(/cisco-.*\.jpg$/);
      expect(service.imageAlt.length).toBeGreaterThan(20);
    }
    expect(detail?.cases).toHaveLength(3);
    expect(detail?.cases.find((caseStudy) => caseStudy.client === "Chewy")?.logoTreatment).toBe(
      "brand",
    );
    expect(detail?.contactEmail).toBe("sales@jototech.cn");
    expect(detail?.heroVisual.src).toMatch(/cisco-network-management\.png$/);
  });

  it("ignores trailing slashes and returns undefined for unknown paths", () => {
    expect(getPartnerDetail("/solutions/network/cisco/")?.partnerName).toBe("Cisco");
    expect(getPartnerDetail("/solutions/security/cisco")).toBeUndefined();
  });

  it("provides complete, unique content for every public solution route", () => {
    expect(partnerDetails.map((detail) => detail.pathname)).toEqual(expectedPaths);
    expect(new Set(partnerDetails.map((detail) => detail.pathname)).size).toBe(20);

    for (const detail of partnerDetails) {
      expect(detail.services).toHaveLength(3);
      expect(detail.cases).toHaveLength(3);
      expect(detail.reasons).toHaveLength(3);
      expect(detail.partnerLogo).toBeTruthy();
      expect(detail.heroVisual.src).toBeTruthy();
      expect(getPartnerDetail(`${detail.pathname}/`)?.partnerName).toBe(detail.partnerName);
    }
  });
});
