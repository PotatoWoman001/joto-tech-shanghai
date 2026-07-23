# JOTO TECH Blog Design

## Goal

Add a multilingual editorial Blog to the current JOTO TECH website, with six original articles grounded in JOTO TECH's existing network, security, operations, delivery, case-study, and safeguarding work.

## Navigation

- Desktop primary navigation: `SOLUTIONS / SERVICES / CASE STUDIES / ABOUT / BLOG`.
- Remove `CONTACT` from the primary navigation and render it as a separate action immediately left of the existing language selector.
- Keep the existing language labels unchanged: `EN / 中文 / فارسی`.
- Mobile navigation includes both Blog and Contact in the full-screen menu; the language selector remains in the header.

## Routes

- Blog index: `/blog`.
- Article detail: `/blog/:slug`.
- Existing locale prefixes apply without changing the logical article:
  - `/zh/blog/:slug`
  - `/fa/blog/:slug`
- Unknown article slugs render an on-brand article-not-found state with a link back to the Blog index.

## Blog Index

- Editorial layout inspired by the information hierarchy of `joto.ai/blog`, restyled for the current JOTO TECH visual system.
- Hero label and title use `INSIGHTS` and a concise enterprise-technology introduction.
- One featured article receives a wide, prominent treatment.
- Five additional articles use a responsive card grid.
- Cards show category, title, summary, publication date, reading time, and cover image.
- Visual styling uses the current near-black background, JOTO green accents, fine borders/grid lines, restrained motion, and large editorial typography.

## Article Detail

- Header contains category, title, summary, publication date, reading time, and cover image.
- Body supports headings, paragraphs, lists, and pull quotes where relevant.
- Footer presents related articles and a route back to the Blog index.
- Content must not invent customer names, performance figures, or claims not already supported by the website's approved material.

## Initial Articles

1. Network: Building an Enterprise Network That Can Grow With the Business.
2. Delivery: What a Reliable Multi-site Network Rollout Really Requires.
3. Security: From Alert Volume to Practical Security Response.
4. Operations: What Global Teams Need to Coordinate for IT Operations in China.
5. Case Study: Standardising Infrastructure Across Five Campus Sites.
6. Safeguarding: Why IT and Physical Security Should Be Planned as One Connected System.

Each article has complete English, Simplified Chinese, and Persian content. The case-study article uses only existing approved site information.

## Content Architecture

- Store Blog article records in a dedicated content module rather than expanding the existing general translation dictionary.
- Each article exposes one stable slug and localized title, excerpt, metadata, and structured body content.
- Reuse existing JOTO TECH network, security, services, campus, and safeguarding imagery.
- Add focused Blog page and card components while preserving the project's current lightweight pathname routing and i18n prefix behavior.

## Responsive Behavior

- Desktop: featured split layout, three-column article grid, separate Contact action in the header.
- Tablet: featured content remains prominent and cards collapse to two columns.
- Mobile: single-column cards, readable article measure, full-screen navigation containing Blog and Contact.
- No horizontal overflow at supported breakpoints.

## Verification

- Tests cover navigation order, Contact placement, unchanged language labels, localized Blog links, six index articles, article-detail rendering, locale switching on the same slug, and unknown-slug fallback.
- Verify production build and focused tests.
- Visually inspect desktop, tablet, and mobile layouts in the local browser.
