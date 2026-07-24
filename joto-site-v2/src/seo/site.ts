import type { Locale } from "../i18n/routing";
import routeManifest from "./public-routes.json";

export const SITE_ORIGIN = "https://jotoglobal.com";
export const PUBLIC_ROUTES = routeManifest as readonly string[];

const prefixes: Record<Locale, string> = {
  en: "",
  "zh-CN": "/zh",
  "fa-IR": "/fa",
};

function normalizePublicPath(pathname: string): string {
  const pathOnly = pathname.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  const normalized = withLeadingSlash.replace(/\/+$/, "");
  return normalized || "/";
}

export function localizedPublicPath(pathname: string, locale: Locale): string {
  const normalized = normalizePublicPath(pathname);
  const prefix = prefixes[locale];
  if (normalized === "/") return prefix ? `${prefix}/` : "/";
  return `${prefix}${normalized}`;
}

export function absolutePublicUrl(pathname: string, locale: Locale): string {
  return `${SITE_ORIGIN}${localizedPublicPath(pathname, locale)}`;
}

export function alternateUrls(pathname: string) {
  return [
    { hreflang: "en", href: absolutePublicUrl(pathname, "en") },
    { hreflang: "zh-CN", href: absolutePublicUrl(pathname, "zh-CN") },
    { hreflang: "fa-IR", href: absolutePublicUrl(pathname, "fa-IR") },
    { hreflang: "x-default", href: absolutePublicUrl(pathname, "en") },
  ] as const;
}
