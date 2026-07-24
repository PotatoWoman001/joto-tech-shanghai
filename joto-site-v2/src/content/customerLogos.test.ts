import { describe, expect, it } from "vitest";
import { customerLogoRows } from "./customerLogos";

describe("customer logo content", () => {
  it("contains two balanced rows and 42 unique current brand names", () => {
    const logos = customerLogoRows.flat();
    const names = logos.map((logo) => logo.name);

    expect(customerLogoRows).toHaveLength(2);
    expect(customerLogoRows[0]).toHaveLength(21);
    expect(customerLogoRows[1]).toHaveLength(21);
    expect(logos).toHaveLength(42);
    expect(new Set(names).size).toBe(42);
    expect(names).toContain("FORVIA");
    expect(names).toContain("Guolian Minsheng Securities");
    expect(names).not.toContain("Faurecia");
    expect(names).not.toContain("Guolian Securities");
  });

  it("uses local bundled asset URLs only", () => {
    for (const logo of customerLogoRows.flat()) {
      expect(logo.src).not.toMatch(/^https?:/);
      expect(logo.src).toMatch(/\.(png|svg)$/);
    }
  });

  it("preserves internal contrast for enclosed multicolor marks", () => {
    const contrastNames = customerLogoRows
      .flat()
      .filter((logo) => logo.treatment === "contrast")
      .map((logo) => logo.name);

    expect(contrastNames).toEqual([
      "Haday",
      "Starbucks",
      "ChinaAMC",
      "Changshu Rural Commercial Bank",
      "BY-HEALTH",
    ]);
  });

  it("keeps original colors for marks that lose meaning under a monochrome filter", () => {
    const originalNames = customerLogoRows
      .flat()
      .filter((logo) => logo.treatment === "original")
      .map((logo) => logo.name);

    expect(originalNames).toEqual(["Orange", "FORVIA", "Yuwell", "WuXi AppTec"]);
  });
});
