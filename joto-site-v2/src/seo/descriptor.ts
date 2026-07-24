import { getBlogArticle } from "../content/blog";
import { getPartnerDetail } from "../content/partners";
import { getSolutionCategoryDetail } from "../content/solutionCategories";
import type { Locale } from "../i18n/routing";
import { localizePartnerDetail, translate } from "../i18n/translations";
import { fixedSeoCopy, type FixedPageKey } from "./content";
import {
  SITE_ORIGIN,
  absolutePublicUrl,
  alternateUrls,
} from "./site";
import { buildStructuredData } from "./structuredData";
import type {
  OpenGraphType,
  SeoDescriptor,
  SeoStatus,
} from "./types";

const DEFAULT_IMAGE_WIDTH = 1734;
const DEFAULT_IMAGE_HEIGHT = 907;
const DEFAULT_IMAGE_URL = `${SITE_ORIGIN}/og.png`;

const fixedPagePaths: Record<string, FixedPageKey> = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/blog": "blog",
};

const solutionNames: Record<string, string> = {
  network: "Network",
  security: "Security",
  "server-storage": "Server & Storage",
  collaboration: "Collaboration",
  safeguarding: "Safeguarding",
};

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  "zh-CN": "zh_CN",
  "fa-IR": "fa_IR",
};

const defaultImageAlt: Record<Locale, string> = {
  en: "JOTO TECH enterprise IT solutions",
  "zh-CN": "JOTO TECH 企业 IT 解决方案",
  "fa-IR": "راهکارهای فناوری اطلاعات سازمانی JOTO TECH",
};

const nonPublicCopy: Record<
  Locale,
  Record<Exclude<SeoStatus, "public">, { title: string; description: string }>
> = {
  en: {
    preview: {
      title: "Preview | JOTO TECH",
      description: "Internal JOTO TECH page preview.",
    },
    "not-found": {
      title: "Page Not Found | JOTO TECH",
      description: "The requested JOTO TECH page could not be found.",
    },
  },
  "zh-CN": {
    preview: {
      title: "页面预览 | JOTO TECH",
      description: "JOTO TECH 内部页面预览。",
    },
    "not-found": {
      title: "页面未找到 | JOTO TECH",
      description: "未找到您访问的 JOTO TECH 页面。",
    },
  },
  "fa-IR": {
    preview: {
      title: "پیش‌نمایش صفحه | JOTO TECH",
      description: "پیش‌نمایش داخلی صفحه JOTO TECH.",
    },
    "not-found": {
      title: "صفحه پیدا نشد | JOTO TECH",
      description: "صفحه درخواستی JOTO TECH پیدا نشد.",
    },
  },
};

function normalizePathname(pathname: string): string {
  const pathOnly = pathname.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  const normalized = withLeadingSlash.replace(/\/+$/, "");
  return normalized || "/";
}

function articleTitle(title: string) {
  return `${title} | JOTO TECH`;
}

function categoryTitle(locale: Locale, title: string) {
  if (locale === "zh-CN") {
    return `${title}解决方案、系统集成与运维 | JOTO TECH`;
  }
  if (locale === "fa-IR") {
    return `راهکار، یکپارچه‌سازی و پشتیبانی ${title} | JOTO TECH`;
  }
  return `${title} Solutions, Integration & Support | JOTO TECH`;
}

function partnerTitle(locale: Locale, partner: string, solution: string) {
  if (locale === "zh-CN") {
    return `${partner} 企业${solution}解决方案、部署与运维 | JOTO TECH`;
  }
  if (locale === "fa-IR") {
    return `راهکار، استقرار و پشتیبانی ${partner} برای ${solution} | JOTO TECH`;
  }
  return `${partner} ${solution} Solutions, Deployment & Support | JOTO TECH`;
}

function openGraph(
  locale: Locale,
  title: string,
  description: string,
  type: OpenGraphType,
  url?: string,
): SeoDescriptor["openGraph"] {
  return {
    type,
    title,
    description,
    url,
    locale: openGraphLocales[locale],
    alternateLocales: Object.values(openGraphLocales).filter(
      (candidate) => candidate !== openGraphLocales[locale],
    ),
    image: DEFAULT_IMAGE_URL,
    imageAlt: defaultImageAlt[locale],
    imageWidth: DEFAULT_IMAGE_WIDTH,
    imageHeight: DEFAULT_IMAGE_HEIGHT,
  };
}

function publicDescriptor(
  locale: Locale,
  pathname: string,
  title: string,
  description: string,
  type: OpenGraphType = "website",
): SeoDescriptor {
  const canonicalUrl = absolutePublicUrl(pathname, locale);

  return {
    status: "public",
    title,
    description,
    robots: "index, follow",
    canonicalUrl,
    alternates: alternateUrls(pathname),
    openGraph: openGraph(locale, title, description, type, canonicalUrl),
    structuredData: buildStructuredData({
      locale,
      pathname,
      title,
      description,
      canonicalUrl,
    }),
  };
}

function nonPublicDescriptor(
  locale: Locale,
  status: Exclude<SeoStatus, "public">,
): SeoDescriptor {
  const copy = nonPublicCopy[locale][status];

  return {
    status,
    ...copy,
    robots: "noindex, nofollow",
    alternates: [],
    openGraph: openGraph(locale, copy.title, copy.description, "website"),
    structuredData: [],
  };
}

export function buildSeoDescriptor(
  locale: Locale,
  pathname: string,
): SeoDescriptor {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath.startsWith("/preview/")) {
    return nonPublicDescriptor(locale, "preview");
  }

  const fixedPageKey = fixedPagePaths[normalizedPath];
  if (fixedPageKey) {
    const copy = fixedSeoCopy[locale][fixedPageKey];
    return publicDescriptor(
      locale,
      normalizedPath,
      copy.title,
      copy.description,
    );
  }

  const articleMatch = normalizedPath.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = getBlogArticle(articleMatch[1]);
    if (article) {
      const translation = article.translations[locale];
      return publicDescriptor(
        locale,
        normalizedPath,
        articleTitle(translation.title),
        translation.excerpt,
        "article",
      );
    }
  }

  const category = getSolutionCategoryDetail(normalizedPath, locale);
  if (category) {
    const name = translate(locale, solutionNames[category.id] ?? category.id);
    return publicDescriptor(
      locale,
      normalizedPath,
      categoryTitle(locale, name),
      category.summary,
    );
  }

  const partner = localizePartnerDetail(
    locale,
    getPartnerDetail(normalizedPath),
  );
  if (partner) {
    return publicDescriptor(
      locale,
      normalizedPath,
      partnerTitle(locale, partner.partnerName, partner.solutionName),
      partner.introduction,
    );
  }

  return nonPublicDescriptor(locale, "not-found");
}
