import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../i18n/I18nProvider";
import { LOCALE_PREFERENCE_KEY } from "../i18n/routing";
import LanguageSelector from "./LanguageSelector";

function renderSelector(pathname = "/") {
  window.history.replaceState({}, "", pathname);
  return render(
    <I18nProvider>
      <LanguageSelector />
    </I18nProvider>,
  );
}

describe("LanguageSelector", () => {
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("shows only the current language until the menu is opened", () => {
    renderSelector("/zh");

    const trigger = screen.getByRole("button", { name: "中文 — 语言选择" });
    expect(trigger).toHaveTextContent("中文");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.queryByText("فارسی")).not.toBeInTheDocument();

    fireEvent.click(trigger);

    const menu = screen.getByRole("menu", { name: "语言选择" });
    expect(within(menu).getByRole("menuitem", { name: "EN" })).toHaveAttribute("href", "/");
    expect(within(menu).getByRole("menuitem", { name: "中文" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(menu).getByRole("menuitem", { name: "فارسی" })).toHaveAttribute(
      "href",
      "/fa",
    );
  });

  it("persists a manual language choice before navigation", () => {
    renderSelector("/");
    fireEvent.click(screen.getByRole("button", { name: "EN — Language selector" }));
    const chineseOption = screen.getByRole("menuitem", { name: "中文" });
    chineseOption.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(chineseOption);

    expect(window.localStorage.getItem(LOCALE_PREFERENCE_KEY)).toBe("zh-CN");
  });

  it("closes the menu with Escape", () => {
    renderSelector("/");
    fireEvent.click(screen.getByRole("button", { name: "EN — Language selector" }));
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
