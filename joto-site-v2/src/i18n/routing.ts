export type Locale = "en" | "zh-CN" | "fa-IR";

export const locales: readonly Locale[] = ["en", "zh-CN", "fa-IR"];

export const localeMeta: Record<Locale, { dir: "ltr" | "rtl"; label: string; prefix: string }> = {
  en: { dir: "ltr", label: "EN", prefix: "" },
  "zh-CN": { dir: "ltr", label: "中文", prefix: "/zh" },
  "fa-IR": { dir: "rtl", label: "فارسی", prefix: "/fa" },
};

export interface LocalizedPath {
  locale: Locale;
  pathname: string;
}

export function parseLocalizedPath(pathname: string): LocalizedPath {
  const normalized = pathname || "/";
  if (normalized === "/zh" || normalized.startsWith("/zh/")) {
    return { locale: "zh-CN", pathname: normalized.slice(3) || "/" };
  }
  if (normalized === "/fa" || normalized.startsWith("/fa/")) {
    return { locale: "fa-IR", pathname: normalized.slice(3) || "/" };
  }
  return { locale: "en", pathname: normalized };
}

export function localizedHref(href: string, locale: Locale): string {
  if (/^(?:https?:|mailto:|tel:)/.test(href)) return href;
  const prefix = localeMeta[locale].prefix;
  if (href.startsWith("#")) return `${prefix || ""}${href}`;
  const match = href.match(/^([^?#]*)(.*)$/);
  const pathPart = match?.[1] || "/";
  const suffix = match?.[2] || "";
  const { pathname } = parseLocalizedPath(pathPart);
  return `${`${prefix}${pathname === "/" ? "" : pathname}` || "/"}${suffix}`;
}

export function localeSwitchHref(target: Locale, currentPath: string, hash = ""): string {
  const { pathname } = parseLocalizedPath(currentPath);
  return `${localizedHref(pathname, target)}${hash}`;
}
