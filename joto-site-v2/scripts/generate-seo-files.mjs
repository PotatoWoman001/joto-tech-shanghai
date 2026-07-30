import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";

const SITE_ORIGIN = "https://jotoglobal.com";
const routeManifestUrl = new URL("../src/seo/public-routes.json", import.meta.url);
const mallCatalogUrl = new URL(
  "../public/mall-data/data/catalog-index.json",
  import.meta.url,
);
const defaultOutputDirectory = new URL("../dist/", import.meta.url);

const locales = [
  { hreflang: "en", prefix: "" },
  { hreflang: "zh-CN", prefix: "/zh" },
  { hreflang: "fa-IR", prefix: "/fa" },
];

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizePublicPath(pathname) {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalized = withLeadingSlash.replace(/\/+$/, "");
  return normalized || "/";
}

function localizedUrl(pathname, prefix) {
  const normalized = normalizePublicPath(pathname);
  const localizedPath =
    normalized === "/" ? (prefix ? `${prefix}/` : "/") : `${prefix}${normalized}`;
  return `${SITE_ORIGIN}${localizedPath}`;
}

function alternateLinks(pathname) {
  const links = locales.map(({ hreflang, prefix }) => ({
    hreflang,
    href: localizedUrl(pathname, prefix),
  }));

  return [
    ...links,
    { hreflang: "x-default", href: localizedUrl(pathname, "") },
  ];
}

function sitemapEntry(pathname, prefix) {
  const links = alternateLinks(pathname)
    .map(
      ({ hreflang, href }) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
    )
    .join("\n");

  return [
    "  <url>",
    `    <loc>${escapeXml(localizedUrl(pathname, prefix))}</loc>`,
    links,
    "  </url>",
  ].join("\n");
}

function buildSitemap(routes) {
  const entries = routes.flatMap((pathname) =>
    locales.map(({ prefix }) => sitemapEntry(pathname, prefix)),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /preview/",
  "Disallow: /zh/preview/",
  "Disallow: /fa/preview/",
  "",
  "Sitemap: https://jotoglobal.com/sitemap.xml",
  "",
].join("\n");

export async function generateSeoFiles(outputDirectory = defaultOutputDirectory) {
  const routes = JSON.parse(await readFile(routeManifestUrl, "utf8"));
  if (!Array.isArray(routes) || routes.some((route) => typeof route !== "string")) {
    throw new TypeError("SEO route manifest must be an array of strings.");
  }
  try {
    const catalog = JSON.parse(await readFile(mallCatalogUrl, "utf8"));
    const mallRoutes = (catalog.products ?? []).map(
      (product) => `/mall/products/${product.slug}`,
    );
    routes.push(...mallRoutes);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  await mkdir(outputDirectory, { recursive: true });
  const outputUrl =
    outputDirectory instanceof URL
      ? outputDirectory
      : pathToFileURL(`${resolve(outputDirectory)}/`);
  const sitemapUrl = new URL("sitemap.xml", outputUrl);
  const robotsUrl = new URL("robots.txt", outputUrl);

  await Promise.all([
    writeFile(sitemapUrl, buildSitemap(routes), "utf8"),
    writeFile(robotsUrl, robots, "utf8"),
  ]);

  return {
    sitemapPath: fileURLToPath(sitemapUrl),
    robotsPath: fileURLToPath(robotsUrl),
  };
}

const isDirectRun =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectRun) {
  await generateSeoFiles();
}
