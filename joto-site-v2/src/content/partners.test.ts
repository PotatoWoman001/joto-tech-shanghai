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
    expect(detail?.cases.find((caseStudy) => caseStudy.client === "Chewy")?.logoTreatment).toBeUndefined();
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
      expect(detail.reasons).toHaveLength(3);
      expect(detail.partnerLogo).toBeTruthy();
      expect(detail.heroVisual.src).toBeTruthy();
      expect(getPartnerDetail(`${detail.pathname}/`)?.partnerName).toBe(detail.partnerName);
    }

    const nonCiscoDetails = partnerDetails.filter((detail) => detail.partnerName !== "Cisco");
    expect(nonCiscoDetails).toHaveLength(19);
    expect(nonCiscoDetails.every((detail) => detail.cases.length === 0)).toBe(true);
    expect(new Set(nonCiscoDetails.map((detail) => detail.title)).size).toBe(19);
    expect(new Set(nonCiscoDetails.map((detail) => detail.accent)).size).toBe(19);
    expect(new Set(nonCiscoDetails.map((detail) => detail.relationshipTitle)).size).toBe(19);
    expect(new Set(nonCiscoDetails.map((detail) => detail.servicesTitle)).size).toBe(19);
    expect(new Set(nonCiscoDetails.map((detail) => detail.ctaTitle)).size).toBe(19);

    for (const detail of nonCiscoDetails) {
      expect(detail.title).not.toBe(`${detail.partnerName} solutions,`);
      expect(detail.accent).not.toBe("delivered by JOTO.");
      expect(detail.relationshipTitle).not.toBe(
        `${detail.partnerName} technology, shaped around your environment.`,
      );
    }
  });

  it("assigns four explicit non-Cisco visuals to every additional partner", () => {
    const cisco = getPartnerDetail("/solutions/network/cisco")!;
    const ciscoImages = new Set([
      cisco.heroVisual.src,
      ...cisco.services.map(({ image }) => image),
    ]);
    const nonCiscoDetails = partnerDetails.filter(
      ({ partnerName }) => partnerName !== "Cisco",
    );

    for (const detail of nonCiscoDetails) {
      const images = [
        detail.heroVisual.src,
        ...detail.services.map(({ image }) => image),
      ];

      expect(new Set(images).size).toBe(4);
      expect(images.every((image) => !ciscoImages.has(image))).toBe(true);
    }
  });

  it("does not reuse a visual across different non-Cisco routes", () => {
    const nonCiscoImages = partnerDetails
      .filter(({ partnerName }) => partnerName !== "Cisco")
      .flatMap((detail) => [
        detail.heroVisual.src,
        ...detail.services.map(({ image }) => image),
      ]);

    expect(new Set(nonCiscoImages).size).toBe(19 * 4);
  });

  it("assigns a partnership badge to every detail route", () => {
    expect(partnerDetails.every((detail) => detail.partnerBadge)).toBe(true);
    expect(
      partnerDetails
        .filter((detail) => detail.partnerBadge === "Gold Partner")
        .map((detail) => detail.pathname),
    ).toEqual([
      "/solutions/network/cisco",
      "/solutions/network/extreme-networks",
      "/solutions/network/sangfor",
      "/solutions/security/fortinet",
      "/solutions/security/sangfor",
    ]);
    expect(getPartnerDetail("/solutions/security/palo-alto-networks")?.partnerBadge).toBe(
      "Platinum Partner",
    );
    expect(getPartnerDetail("/solutions/network/aruba")?.partnerBadge).toBe("Partner");
  });

  it("assigns a partnership badge to every detail route", () => {
    expect(partnerDetails.every((detail) => detail.partnerBadge)).toBe(true);
    expect(
      partnerDetails
        .filter((detail) => detail.partnerBadge === "Gold Partner")
        .map((detail) => detail.pathname),
    ).toEqual([
      "/solutions/network/cisco",
      "/solutions/network/extreme-networks",
      "/solutions/network/sangfor",
      "/solutions/security/fortinet",
      "/solutions/security/sangfor",
    ]);
    expect(getPartnerDetail("/solutions/security/palo-alto-networks")?.partnerBadge).toBe(
      "Platinum Partner",
    );
    expect(getPartnerDetail("/solutions/network/aruba")?.partnerBadge).toBe("Partner");
  });
});
