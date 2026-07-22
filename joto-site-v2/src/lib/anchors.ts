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
  return `${fromDetailPage ? "/" : ""}#${anchor}`;
}

export function pageHref(href: string, fromDetailPage: boolean) {
  return fromDetailPage && href.startsWith("#") ? `/${href}` : href;
}
