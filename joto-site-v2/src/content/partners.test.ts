import { describe, expect, it } from "vitest";
import { getPartnerDetail } from "./partners";

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
    expect(detail?.contactEmail).toBe("sales@jototech.cn");
    expect(detail?.heroVisual.src).toMatch(/cisco-network-management\.png$/);
  });

  it("ignores trailing slashes and returns undefined for unknown paths", () => {
    expect(getPartnerDetail("/solutions/network/cisco/")?.partnerName).toBe("Cisco");
    expect(getPartnerDetail("/solutions/security/cisco")).toBeUndefined();
  });
});
