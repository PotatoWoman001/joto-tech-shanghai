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
      "ChinaAMC",
      "Changshu Rural Commercial Bank",
      "BY-HEALTH",
    ]);
  });

  it("uses complete wordmark assets for brands whose symbols are ambiguous", () => {
    const logosByName = new Map(
      customerLogoRows.flat().map((logo) => [logo.name, logo]),
    );

    for (const name of [
      "McDonald’s",
      "Orange",
      "FORVIA",
      "Yuwell",
      "WuXi AppTec",
      "Starbucks",
      "Huawei",
    ]) {
      expect(logosByName.get(name)?.src).toContain("wordmark");
      expect(logosByName.get(name)?.treatment ?? "solid").toBe("solid");
    }
  });
});
