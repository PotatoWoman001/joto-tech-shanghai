export type Locale = "en" | "zh-CN" | "fa-IR";

export const locales: readonly Locale[] = ["en", "zh-CN", "fa-IR"];
export const LOCALE_PREFERENCE_KEY = "joto:locale";

export const localeMeta: Record<Locale, { dir: "ltr" | "rtl"; label: string; prefix: string }> = {
  en: { dir: "ltr", label: "EN", prefix: "" },
  "zh-CN": { dir: "ltr", label: "中文", prefix: "/zh" },
  "fa-IR": { dir: "rtl", label: "فارسی", prefix: "/fa" },
};

export interface LocalizedPath {
  locale: Locale;
  pathname: string;
}

export function isLocale(value: string | null): value is Locale {
  return locales.includes(value as Locale);
}

export function detectLocaleFromLanguages(languages: readonly string[]): Locale {
  for (const language of languages) {
    const normalized = language.toLowerCase();
    if (normalized === "zh" || normalized.startsWith("zh-")) return "zh-CN";
    if (normalized === "fa" || normalized.startsWith("fa-")) return "fa-IR";
  }
  return "en";
}

function normalizedBasePath(baseUrl = import.meta.env.BASE_URL): string {
  const withLeadingSlash = baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`;
  return withLeadingSlash === "/" ? "" : withLeadingSlash.replace(/\/+$/, "");
}

export function stripBasePath(
  pathname: string,
  baseUrl = import.meta.env.BASE_URL,
): string {
  const basePath = normalizedBasePath(baseUrl);
  if (!basePath) return pathname || "/";
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname || "/";
}

export function prependBasePath(
  pathname: string,
  baseUrl = import.meta.env.BASE_URL,
): string {
  const basePath = normalizedBasePath(baseUrl);
  if (!basePath) return pathname || "/";
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${basePath}${normalizedPath}`;
}

export function explicitLocaleFromPath(pathname: string): Exclude<Locale, "en"> | null {
  const normalized = stripBasePath(pathname || "/");
  if (normalized === "/zh" || normalized.startsWith("/zh/")) return "zh-CN";
  if (normalized === "/fa" || normalized.startsWith("/fa/")) return "fa-IR";
  return null;
}

export function parseLocalizedPath(pathname: string): LocalizedPath {
  const normalized = stripBasePath(pathname || "/");
  const explicitLocale = explicitLocaleFromPath(pathname);
  if (explicitLocale === "zh-CN") {
    return { locale: "zh-CN", pathname: normalized.slice(3) || "/" };
  }
  if (explicitLocale === "fa-IR") {
    return { locale: "fa-IR", pathname: normalized.slice(3) || "/" };
  }
  return { locale: "en", pathname: normalized };
}

export function localizedHref(href: string, locale: Locale): string {
  if (/^(?:https?:|mailto:|tel:)/.test(href)) return href;
  const prefix = localeMeta[locale].prefix;
  if (href.startsWith("#")) {
    return prefix ? prependBasePath(`${prefix}${href}`) : href;
  }
  const match = href.match(/^([^?#]*)(.*)$/);
  const pathPart = match?.[1] || "/";
  const suffix = match?.[2] || "";
  const { pathname } = parseLocalizedPath(pathPart);
  const localizedPath =
    pathname === "/" ? (prefix ? `${prefix}/` : "/") : `${prefix}${pathname}`;
  return `${prependBasePath(localizedPath)}${suffix}`;
}

export function localeSwitchHref(target: Locale, currentPath: string, hash = ""): string {
  const { pathname } = parseLocalizedPath(currentPath);
  return `${localizedHref(pathname, target)}${hash}`;
}
