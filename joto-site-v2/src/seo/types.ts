export type SeoStatus = "public" | "preview" | "not-found";
export type OpenGraphType = "website" | "article";

export interface SeoAlternate {
  hreflang: "en" | "zh-CN" | "fa-IR" | "x-default";
  href: string;
}

export interface JsonLdNode {
  "@context"?: "https://schema.org";
  "@type": string | string[];
  "@id"?: string;
  [key: string]: unknown;
}

export interface SeoDescriptor {
  status: SeoStatus;
  title: string;
  description: string;
  robots: "index, follow" | "noindex, nofollow";
  canonicalUrl?: string;
  alternates: readonly SeoAlternate[];
  openGraph: {
    type: OpenGraphType;
    title: string;
    description: string;
    url?: string;
    locale: string;
    alternateLocales: readonly string[];
    image: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
  };
  structuredData: JsonLdNode[];
}
