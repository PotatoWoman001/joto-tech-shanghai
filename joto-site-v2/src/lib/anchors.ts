export function vendorAnchor(categoryId: string, vendorName: string) {
  const vendorSlug = vendorName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `#solution-${categoryId}-${vendorSlug}`;
}
