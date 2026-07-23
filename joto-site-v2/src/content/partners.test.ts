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

const expectedNonCiscoHeroCopy: Record<string, [string, string]> = {
  "/solutions/network/extreme-networks": [
    "Extreme Networks cloud-driven campus networking,",
    "make complex networks agile and manageable.",
  ],
  "/solutions/network/aruba": [
    "Aruba edge-to-cloud networking,",
    "make every connection secure, seamless and visible.",
  ],
  "/solutions/network/sangfor": [
    "Sangfor secure networking,",
    "connect every branch with consistent security and experience.",
  ],
  "/solutions/security/knowbe4": [
    "KnowBe4 human risk management,",
    "turn awareness into measurable behavior change.",
  ],
  "/solutions/security/palo-alto-networks": [
    "Palo Alto Networks integrated protection,",
    "carry consistent policy across every business boundary.",
  ],
  "/solutions/security/fortinet": [
    "Fortinet security-driven networking,",
    "unify network and security operations in one architecture.",
  ],
  "/solutions/security/sangfor": [
    "Sangfor enterprise security,",
    "build a closed loop from prevention to operations.",
  ],
  "/solutions/security/check-point": [
    "Check Point unified threat prevention,",
    "keep policy consistent and protection continuous.",
  ],
  "/solutions/security/onelogin": [
    "OneLogin unified identity access,",
    "give the right people the right access at the right time.",
  ],
  "/solutions/server-storage/dell-technologies": [
    "Dell Technologies data center infrastructure,",
    "build scalable compute and data foundations for critical work.",
  ],
  "/solutions/server-storage/huawei": [
    "Huawei OceanStor data infrastructure,",
    "keep critical data efficient, resilient and manageable.",
  ],
  "/solutions/server-storage/inspur": [
    "Inspur compute and storage,",
    "unlock infrastructure potential for dense compute and data growth.",
  ],
  "/solutions/collaboration/audiocodes": [
    "AudioCodes enterprise voice connectivity,",
    "connect Teams, carriers and existing voice without friction.",
  ],
  "/solutions/collaboration/vodia": [
    "Vodia multi-tenant IP communications,",
    "support enterprise and service-provider voice on one flexible platform.",
  ],
  "/solutions/collaboration/cyberdata": [
    "CyberData IP intercom and paging,",
    "make on-site messages clear, locatable and actionable.",
  ],
  "/solutions/collaboration/informacast": [
    "InformaCast critical event notification,",
    "reach the right people when every second matters.",
  ],
  "/solutions/safeguarding/verkada": [
    "Verkada cloud-managed physical security,",
    "bring video, access and environmental context into one view.",
  ],
  "/solutions/safeguarding/hikvision": [
    "Hikvision intelligent physical security,",
    "turn site visibility into manageable protection.",
  ],
  "/solutions/safeguarding/keyking": [
    "Keyking access control and integrated security,",
    "make every entry authorized, recorded and traceable.",
  ],
};

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
    expect(detail?.title).toBe("Cisco solutions,");
    expect(detail?.accent).toBe("delivered by JOTO.");
    expect(detail?.introduction).toBe(
      "JOTO helps enterprises plan, deploy and operate Cisco network infrastructure across offices, campuses, factories and data centers. Our team brings practical experience across Catalyst, Nexus, Meraki and Cisco UCS, with support covering both project delivery and daily operations.",
    );
    expect(detail?.services.map((service) => service.title)).toEqual([
      "Consulting & Design",
      "Integration & Support",
      "Managed Services",
    ]);
    expect(detail?.cases.map((item) => item.client)).toEqual([
      "Harrow International School",
      "Danaher",
      "Chewy",
    ]);
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
  });

  it("maps the approved master copy to the 19 non-Cisco pages without invented projects", () => {
    const nonCiscoDetails = partnerDetails.filter((detail) => detail.partnerName !== "Cisco");

    expect(nonCiscoDetails).toHaveLength(19);
    for (const detail of nonCiscoDetails) {
      expect([detail.title, detail.accent]).toEqual(expectedNonCiscoHeroCopy[detail.pathname]);
      expect(detail.casesEyebrow).toBe("Representative Projects");
      expect(detail.cases).toEqual([]);
      expect(detail.relationshipTitle).not.toBe(
        `${detail.partnerName} technology, shaped around your environment.`,
      );
      expect(detail.services.map((service) => service.title)).not.toEqual([
        "Assessment & Architecture",
        "Deployment & Integration",
        "Operations & Lifecycle",
      ]);
      expect(detail.ctaTitle).not.toBe(`Discuss your ${detail.partnerName} project with JOTO.`);
    }

    expect(new Set(nonCiscoDetails.map((detail) => detail.accent)).size).toBe(19);
    expect(new Set(nonCiscoDetails.map((detail) => detail.relationshipTitle)).size).toBe(19);
  });
});
