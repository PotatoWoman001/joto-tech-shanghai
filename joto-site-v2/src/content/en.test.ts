import { describe, expect, it } from "vitest";
import { siteContent } from "./en";

describe("English site content", () => {
  it("keeps the approved navigation and hero copy", () => {
    expect(siteContent.nav.map(({ label }) => label)).toEqual([
      "SOLUTIONS",
      "SERVICES",
      "CASE STUDIES",
      "ABOUT",
      "CONTACT",
    ]);
    expect(siteContent.hero.eyebrow).toBe("ENTERPRISE-READY IT SOLUTIONS");
    expect(`${siteContent.hero.headline}${siteContent.hero.accent}`).toBe("BUILD WHAT'S NEXT.");
  });

  it("contains the five approved solution categories and exact vendor order", () => {
    expect(
      Object.fromEntries(
        siteContent.solutions.categories.map((category) => [
          category.title,
          category.vendors.map(({ name }) => name),
        ]),
      ),
    ).toEqual({
      Network: ["Cisco", "Extreme Networks", "Aruba", "Sangfor 深信服"],
      Security: [
        "KnowBe4",
        "Palo Alto Networks",
        "Fortinet",
        "Sangfor 深信服",
        "Check Point",
        "OneLogin",
      ],
      "Server & Storage": ["Dell Technologies", "Huawei", "Inspur 浪潮"],
      Collaboration: ["AudioCodes", "Vodia", "CyberData", "InformaCast"],
      Safeguarding: ["Verkada", "Hikvision", "Keyking"],
    });
  });

  it("shows only the partnership levels supplied for each category", () => {
    const tiers = Object.fromEntries(
      siteContent.solutions.categories.flatMap((category) =>
        category.vendors
          .filter((vendor) => vendor.tier)
          .map((vendor) => [`${category.title}/${vendor.name}`, vendor.tier]),
      ),
    );

    expect(tiers).toEqual({
      "Network/Cisco": "Gold",
      "Network/Extreme Networks": "Gold",
      "Network/Sangfor 深信服": "Gold",
      "Security/Palo Alto Networks": "Platinum",
      "Security/Fortinet": "Gold",
    });
  });

  it("does not include excluded business or template content", () => {
    const serialized = JSON.stringify(siteContent).toLowerCase();
    const excluded = [
      ["code", "nest"].join(""),
      ["joto", "ai"].join(" "),
      ["di", "fy"].join(""),
      ["ai", "gc"].join(""),
    ];

    excluded.forEach((term) => expect(serialized).not.toContain(term));
  });
});
