export function vendorId(categoryId: string, vendorName: string) {
  const vendorSlug = vendorName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `solution-${categoryId}-${vendorSlug}`;
}

export function vendorAnchor(categoryId: string, vendorName: string) {
  const id = vendorId(categoryId, vendorName);

  if (id === "solution-network-cisco") {
    return "/solutions/network/cisco";
  }

  return `#${id}`;
}

export function homeAnchor(anchor: string, fromDetailPage: boolean) {
  return `${fromDetailPage ? "/" : ""}#${anchor}`;
}

export function pageHref(href: string, fromDetailPage: boolean) {
  return fromDetailPage && href.startsWith("#") ? `/${href}` : href;
}
