import { useEffect } from "react";
import type { SeoDescriptor } from "./types";

const MANAGED_SELECTOR = "[data-joto-seo]";

interface DisplacedElement {
  element: Element;
  parent: Node;
  nextSibling: ChildNode | null;
}

function removeManagedElements() {
  document.head
    .querySelectorAll(MANAGED_SELECTOR)
    .forEach((element) => element.remove());
}

function displaceFallbackElements(selectors: readonly string[]) {
  const displaced: DisplacedElement[] = [];
  const seen = new Set<Element>();

  for (const selector of selectors) {
    document.head.querySelectorAll(selector).forEach((element) => {
      if (element.hasAttribute("data-joto-seo") || seen.has(element) || !element.parentNode) {
        return;
      }

      seen.add(element);
      displaced.push({
        element,
        parent: element.parentNode,
        nextSibling: element.nextSibling,
      });
      element.remove();
    });
  }

  return displaced;
}

function restoreFallbackElements(displaced: readonly DisplacedElement[]) {
  for (const { element, parent, nextSibling } of displaced) {
    parent.insertBefore(element, nextSibling?.parentNode === parent ? nextSibling : null);
  }
}

function appendMeta(attribute: "name" | "property", key: string, content: string) {
  const meta = document.createElement("meta");
  meta.setAttribute(attribute, key);
  meta.content = content;
  meta.setAttribute("data-joto-seo", "");
  document.head.append(meta);
}

function appendLink(
  rel: "canonical" | "alternate",
  href: string,
  hreflang?: string,
) {
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (hreflang) link.hreflang = hreflang;
  link.setAttribute("data-joto-seo", "");
  document.head.append(link);
}

export default function SeoHead({ descriptor }: { descriptor: SeoDescriptor }) {
  useEffect(() => {
    document.title = descriptor.title;
    removeManagedElements();

    const displacedFallbacks = displaceFallbackElements([
      'meta[name="description"]',
      'meta[name="robots"]',
      'meta[property="og:site_name"]',
      'meta[property="og:type"]',
      'meta[name="twitter:card"]',
    ]);

    appendMeta("name", "description", descriptor.description);
    appendMeta("name", "robots", descriptor.robots);

    appendMeta("property", "og:type", descriptor.openGraph.type);
    appendMeta("property", "og:site_name", "JOTO TECH");
    appendMeta("property", "og:title", descriptor.openGraph.title);
    appendMeta("property", "og:description", descriptor.openGraph.description);
    if (descriptor.openGraph.url) {
      appendMeta("property", "og:url", descriptor.openGraph.url);
    }
    appendMeta("property", "og:locale", descriptor.openGraph.locale);
    descriptor.openGraph.alternateLocales.forEach((locale) => {
      appendMeta("property", "og:locale:alternate", locale);
    });
    appendMeta("property", "og:image", descriptor.openGraph.image);
    appendMeta("property", "og:image:alt", descriptor.openGraph.imageAlt);
    appendMeta(
      "property",
      "og:image:width",
      String(descriptor.openGraph.imageWidth),
    );
    appendMeta(
      "property",
      "og:image:height",
      String(descriptor.openGraph.imageHeight),
    );

    appendMeta("name", "twitter:card", "summary_large_image");
    appendMeta("name", "twitter:title", descriptor.openGraph.title);
    appendMeta("name", "twitter:description", descriptor.openGraph.description);
    appendMeta("name", "twitter:image", descriptor.openGraph.image);

    if (descriptor.canonicalUrl) {
      appendLink("canonical", descriptor.canonicalUrl);
    }
    descriptor.alternates.forEach(({ hreflang, href }) => {
      appendLink("alternate", href, hreflang);
    });

    return () => {
      removeManagedElements();
      restoreFallbackElements(displacedFallbacks);
    };
  }, [descriptor]);

  return null;
}
