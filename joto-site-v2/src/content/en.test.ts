import { describe, expect, it } from "vitest";
import { siteContent } from "./en";

describe("English site content", () => {
  it("keeps the approved navigation and hero copy", () => {
    expect(siteContent.nav.map(({ label }) => label)).toEqual([
      "SOLUTIONS",
      "SERVICES",
      "CASE STUDIES",
      "ABOUT",
      "BLOG",
    ]);
    expect(siteContent.hero.eyebrow).toBe("ENTERPRISE-READY IT SOLUTIONS");
    expect(
      `${siteContent.hero.headline} ${siteContent.hero.accent} ${siteContent.hero.headlineSecondLine}.`,
    ).toBe("We Make IT Happen.");
    expect(siteContent.nav.find(({ label }) => label === "ABOUT")?.href).toBe("/about");
    expect(siteContent.nav.find(({ label }) => label === "BLOG")?.href).toBe("/blog");
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

  it("assigns a local visual and descriptive alt text to every solution category", () => {
    for (const category of siteContent.solutions.categories) {
      expect(category.image).toMatch(/\.(png|webp|jpg|jpeg)$/i);
      expect(category.imageAlt.trim().length).toBeGreaterThan(10);
    }
  });

  it("uses the international JD.com logo without inversion", () => {
    const jd = siteContent.caseStudies.items.find(
      ({ client }) => client === "JD International",
    );

    expect(jd?.logo).toMatch(/jingdong-international\.png$/i);
    expect(jd?.logoTreatment).toBe("original");
  });

  it("preserves the Starbucks brand colors on its dark case-study card", () => {
    const starbucks = siteContent.caseStudies.items.find(
      ({ client }) => client === "Starbucks China",
    );

    expect(starbucks?.logo).toMatch(/starbucks\.svg$/i);
    expect(starbucks?.logoTreatment).toBe("original");
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

  it("prioritizes the partner logo wall and provides artwork for every brand", () => {
    expect(siteContent.partners.items.slice(0, 8).map(({ name }) => name)).toEqual([
      "Cisco",
      "Extreme Networks",
      "Sangfor 深信服",
      "Fortinet",
      "Palo Alto Networks",
      "KnowBe4",
      "Verkada",
      "Hikvision",
    ]);
    expect(siteContent.partners.items).toHaveLength(19);
    expect(siteContent.partners.items.every(({ logo }) => Boolean(logo))).toBe(true);
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
