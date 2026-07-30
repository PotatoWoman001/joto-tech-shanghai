import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  escapeXml,
  generateSeoFiles,
} from "./generate-seo-files.mjs";

test("generates a complete multilingual sitemap and robots file", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "joto-seo-"));
  const result = await generateSeoFiles(outputDirectory);
  const sitemap = await readFile(result.sitemapPath, "utf8");
  const robots = await readFile(result.robotsPath, "utf8");
  const urlEntries = sitemap.match(/<url>/g) ?? [];
  const alternateLinks = sitemap.match(/<xhtml:link /g) ?? [];

  assert.equal(urlEntries.length, 159);
  assert.equal(alternateLinks.length, 159 * 4);
  assert.match(sitemap, /<loc>https:\/\/jotoglobal\.com\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/jotoglobal\.com\/zh\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/jotoglobal\.com\/fa\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/jotoglobal\.com\/zh\/about<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/jotoglobal\.com\/mall<\/loc>/);
  assert.match(
    sitemap,
    /<loc>https:\/\/jotoglobal\.com\/zh\/mall\/products\/ar1220c-s<\/loc>/,
  );
  assert.match(
    sitemap,
    /hreflang="en" href="https:\/\/jotoglobal\.com\/about"/,
  );
  assert.match(
    sitemap,
    /hreflang="zh-CN" href="https:\/\/jotoglobal\.com\/zh\/about"/,
  );
  assert.match(
    sitemap,
    /hreflang="fa-IR" href="https:\/\/jotoglobal\.com\/fa\/about"/,
  );
  assert.match(
    sitemap,
    /hreflang="x-default" href="https:\/\/jotoglobal\.com\/about"/,
  );
  assert.doesNotMatch(sitemap, /preview/);
  assert.doesNotMatch(sitemap, /<(?:lastmod|changefreq|priority)>/);
  assert.equal(
    robots,
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /preview/",
      "Disallow: /zh/preview/",
      "Disallow: /fa/preview/",
      "",
      "Sitemap: https://jotoglobal.com/sitemap.xml",
      "",
    ].join("\n"),
  );
});

test("escapes every XML-sensitive character", () => {
  assert.equal(
    escapeXml(`A&B <tag> "quoted" 'single'`),
    "A&amp;B &lt;tag&gt; &quot;quoted&quot; &apos;single&apos;",
  );
});
