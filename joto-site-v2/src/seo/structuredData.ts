import jotoLogo from "../assets/brand/joto-logo.png";
import { getBlogArticle } from "../content/blog";
import { getPartnerDetail } from "../content/partners";
import { getSolutionCategoryDetail } from "../content/solutionCategories";
import type { Locale } from "../i18n/routing";
import { localizePartnerDetail, translate } from "../i18n/translations";
import { SITE_ORIGIN, absolutePublicUrl } from "./site";
import type { JsonLdNode } from "./types";

const organizationId = `${SITE_ORIGIN}/#organization`;
const websiteId = `${SITE_ORIGIN}/#website`;
const absoluteLogoUrl = new URL(jotoLogo, SITE_ORIGIN).href;

const homeNames: Record<Locale, string> = {
  en: "Home",
  "zh-CN": "首页",
  "fa-IR": "خانه",
};

const fixedPageNames: Record<string, Partial<Record<Locale, string>>> = {
  "/about": {
    en: "About JOTO TECH",
    "zh-CN": "关于 JOTO TECH",
    "fa-IR": "درباره JOTO TECH",
  },
  "/contact": {
    en: "Contact JOTO TECH",
    "zh-CN": "联系 JOTO TECH",
    "fa-IR": "تماس با JOTO TECH",
  },
  "/blog": {
    en: "Insights",
    "zh-CN": "最新资讯",
    "fa-IR": "دیدگاه‌ها",
  },
};

const solutionNames: Record<string, string> = {
  network: "Network",
  security: "Security",
  "server-storage": "Server & Storage",
  collaboration: "Collaboration",
  safeguarding: "Safeguarding",
};

interface StructuredDataInput {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  canonicalUrl: string;
}

interface BreadcrumbItem {
  name: string;
  pathname: string;
}

function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: "JOTO TECH",
    legalName: "JOTO Tech (SH) Co., Ltd.",
    url: `${SITE_ORIGIN}/`,
    logo: absoluteLogoUrl,
    email: "sales@jototech.cn",
    foundingDate: "2010",
  };
}

function websiteNode(locale: Locale): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${SITE_ORIGIN}/`,
    name: "JOTO TECH",
    inLanguage: locale,
    publisher: { "@id": organizationId },
  };
}

function pageNode(
  input: StructuredDataInput,
  pageType: "WebPage" | "AboutPage" | "ContactPage",
): JsonLdNode {
  const node: JsonLdNode = {
    "@type": pageType,
    "@id": `${input.canonicalUrl}#webpage`,
    url: input.canonicalUrl,
    name: input.title,
    description: input.description,
    inLanguage: input.locale,
    isPartOf: { "@id": websiteId },
  };

  if (pageType === "AboutPage") {
    node.about = { "@id": organizationId };
  } else if (pageType === "ContactPage") {
    node.mainEntity = { "@id": organizationId };
  }

  return node;
}

function breadcrumbItems(
  locale: Locale,
  pathname: string,
  currentPageName: string,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: homeNames[locale], pathname: "/" },
  ];

  const articleMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = getBlogArticle(articleMatch[1]);
    items.push({
      name: fixedPageNames["/blog"][locale] ?? "Insights",
      pathname: "/blog",
    });
    items.push({
      name: article?.translations[locale].title ?? currentPageName,
      pathname,
    });
    return items;
  }

  const partner = localizePartnerDetail(locale, getPartnerDetail(pathname));
  if (partner) {
    const categoryPath = pathname.split("/").slice(0, 3).join("/");
    items.push({
      name: partner.solutionName,
      pathname: categoryPath,
    });
    items.push({ name: partner.partnerName, pathname });
    return items;
  }

  const category = getSolutionCategoryDetail(pathname, locale);
  if (category) {
    items.push({
      name: translate(
        locale,
        solutionNames[category.id] ?? category.id,
      ),
      pathname,
    });
    return items;
  }

  items.push({
    name: fixedPageNames[pathname]?.[locale] ?? currentPageName,
    pathname,
  });
  return items;
}

function breadcrumbNode(input: StructuredDataInput): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${input.canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems(
      input.locale,
      input.pathname,
      input.title,
    ).map(({ name, pathname }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absolutePublicUrl(pathname, input.locale),
    })),
  };
}

function articleNode(
  input: StructuredDataInput,
  slug: string,
): JsonLdNode | undefined {
  const article = getBlogArticle(slug);
  if (!article) return undefined;

  const translation = article.translations[input.locale];
  return {
    "@type": "Article",
    "@id": `${input.canonicalUrl}#article`,
    mainEntityOfPage: { "@id": `${input.canonicalUrl}#webpage` },
    headline: translation.title,
    description: translation.excerpt,
    image: new URL(article.image, SITE_ORIGIN).href,
    datePublished: article.publishedAt,
    inLanguage: input.locale,
    publisher: { "@id": organizationId },
  };
}

export function buildStructuredData(
  input: StructuredDataInput,
): JsonLdNode[] {
  const nodes: JsonLdNode[] = [organizationNode()];

  if (input.pathname === "/") {
    return [
      ...nodes,
      websiteNode(input.locale),
      pageNode(input, "WebPage"),
    ];
  }

  const articleMatch = input.pathname.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = articleNode(input, articleMatch[1]);
    nodes.push(pageNode(input, "WebPage"));
    if (article) nodes.push(article);
    nodes.push(breadcrumbNode(input));
    return nodes;
  }

  const pageType =
    input.pathname === "/about"
      ? "AboutPage"
      : input.pathname === "/contact"
        ? "ContactPage"
        : "WebPage";

  nodes.push(pageNode(input, pageType), breadcrumbNode(input));
  return nodes;
}
