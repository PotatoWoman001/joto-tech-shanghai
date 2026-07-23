export function vendorId(categoryId: string, vendorName: string) {
  const vendorSlug = vendorName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `solution-${categoryId}-${vendorSlug}`;
}

export function vendorAnchor(categoryId: string, vendorName: string) {
  return `/solutions/${categoryId}/${vendorId(categoryId, vendorName).replace(
    `solution-${categoryId}-`,
    "",
  )}`;
}

export function homeAnchor(anchor: string, fromDetailPage: boolean) {
  const home = localizedHref("/", currentLocale());
  return `${fromDetailPage ? home : ""}#${anchor}`;
}

export function pageHref(href: string, fromDetailPage: boolean) {
  if (href.startsWith("#")) {
    return fromDetailPage ? `${localizedHref("/", currentLocale())}${href}` : href;
  }
  return localizedHref(href, currentLocale());
}
import { localizedHref, parseLocalizedPath } from "../i18n/routing";

function currentLocale() {
  return parseLocalizedPath(typeof window === "undefined" ? "/" : window.location.pathname).locale;
}
