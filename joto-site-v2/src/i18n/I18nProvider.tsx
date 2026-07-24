import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { SiteContent } from "../content/types";
import { siteContentByLocale, translate } from "./translations";
import {
  detectLocaleFromLanguages,
  explicitLocaleFromPath,
  isLocale,
  localeMeta,
  localeSwitchHref,
  LOCALE_PREFERENCE_KEY,
  parseLocalizedPath,
  type Locale,
} from "./routing";

interface I18nValue {
  locale: Locale;
  pathname: string;
  direction: "ltr" | "rtl";
  siteContent: SiteContent;
  t: (source: string) => string;
  switchHref: (locale: Locale) => string;
}

const I18nContext = createContext<I18nValue>({
  locale: "en",
  pathname: "/",
  direction: "ltr",
  siteContent: siteContentByLocale.en,
  t: (source) => source,
  switchHref: (target) => localeSwitchHref(target, "/"),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const hash = typeof window === "undefined" ? "" : window.location.hash;
  const { locale, pathname } = parseLocalizedPath(currentPath);
  const direction = localeMeta[locale].dir;

  useEffect(() => {
    const explicitLocale = explicitLocaleFromPath(currentPath);

    try {
      if (explicitLocale) {
        window.localStorage.setItem(LOCALE_PREFERENCE_KEY, explicitLocale);
        return;
      }

      const storedLocale = window.localStorage.getItem(LOCALE_PREFERENCE_KEY);
      const preferredLocale = isLocale(storedLocale)
        ? storedLocale
        : detectLocaleFromLanguages(
            navigator.languages?.length ? navigator.languages : [navigator.language],
          );

      if (preferredLocale === "en") return;

      const destination = localeSwitchHref(preferredLocale, currentPath, hash);
      if (destination !== `${currentPath}${hash}`) window.location.replace(destination);
    } catch {
      // Storage can be unavailable in privacy-restricted browsers; keep the current route.
    }
  }, [currentPath, hash]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.title =
      locale === "zh-CN"
        ? "JOTO TECH — 让 IT 真正发生"
        : locale === "fa-IR"
          ? "JOTO TECH — فناوری اطلاعات را عملی می‌کنیم"
          : "JOTO TECH — We Make IT Happen";
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute(
      "content",
      siteContentByLocale[locale].hero.description,
    );
  }, [direction, locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        pathname,
        direction,
        siteContent: siteContentByLocale[locale],
        t: (source) => translate(locale, source),
        switchHref: (target) => localeSwitchHref(target, currentPath, hash),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
