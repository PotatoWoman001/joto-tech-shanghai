import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Header from "../components/Header";
import { getPartnerDetail } from "../content/partners";
import { I18nProvider } from "./I18nProvider";
import { localizePartnerDetail, siteContentByLocale } from "./translations";

afterEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, "", "/");
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});

describe("trilingual experience", () => {
  it("applies Persian RTL to the document while keeping the header LTR", async () => {
    window.history.replaceState({}, "", "/fa/contact");
    render(
      <I18nProvider>
        <Header />
      </I18nProvider>,
    );

    await waitFor(() => expect(document.documentElement).toHaveAttribute("dir", "rtl"));
    expect(document.documentElement).toHaveAttribute("lang", "fa-IR");
    expect(document.querySelector("header")).toHaveAttribute("dir", "ltr");
    fireEvent.click(screen.getByRole("button", { name: "فارسی — انتخاب زبان" }));
    expect(screen.getByRole("menuitem", { name: "فارسی" })).toHaveAttribute(
      "href",
      "/fa/contact",
    );
    expect(screen.getByRole("menuitem", { name: "中文" })).toHaveAttribute(
      "href",
      "/zh/contact",
    );
  });

  it("provides localized site and partner-detail content", () => {
    expect(siteContentByLocale["zh-CN"].nav[0].label).toBe("解决方案");
    expect(siteContentByLocale["fa-IR"].services.title).toContain("عملیات پایدار");
    const detail = localizePartnerDetail(
      "fa-IR",
      getPartnerDetail("/solutions/security/palo-alto-networks"),
    );
    expect(detail?.title).toContain("حفاظت یکپارچه Palo Alto Networks");
    expect(detail?.services[0].title).toBe("معماری NGFW و سیاست");
  });

  it("localizes the five hero solution domains", () => {
    expect(siteContentByLocale.en.hero.accentWords).toEqual([
      "IT",
      "Network",
      "Safeguarding",
      "Collaboration",
      "Security",
    ]);
    expect(siteContentByLocale["zh-CN"].hero.accentWords).toEqual([
      "IT",
      "网络",
      "物理安防",
      "协作通信",
      "安全",
    ]);
    expect(siteContentByLocale["fa-IR"].hero.accentWords).toEqual([
      "فناوری اطلاعات",
      "شبکه",
      "حفاظت فیزیکی",
      "ارتباطات یکپارچه",
      "امنیت",
    ]);
  });

  it("positions IT procurement for international operations in all three languages", () => {
    const descriptions = Object.fromEntries(
      Object.entries(siteContentByLocale).map(([locale, content]) => [
        locale,
        content.services.items.find(({ icon }) => icon === "procurement")?.description,
      ]),
    );

    expect(descriptions.en).toContain("global markets");
    expect(descriptions["zh-CN"]).toContain("全球业务");
    expect(descriptions["zh-CN"]).not.toContain("在华");
    expect(descriptions["fa-IR"]).toContain("بازارهای جهانی");
    expect(descriptions["fa-IR"]).not.toContain("چین");
  });
});
