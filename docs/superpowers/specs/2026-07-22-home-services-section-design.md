# Homepage Services Section Design

## Goal

Replace the homepage's four delivery cards with the six approved service offerings from the supplied JOTO reference site, while keeping the existing JOTO V2 page language and direct in-page navigation.

## Approved content and behavior

- Keep the section at `#services`; header and footer Services links continue to target the homepage anchor and do not open service detail pages.
- Change the eyebrow from `END-TO-END DELIVERY` to `END-TO-END SERVICES`.
- Keep the heading `From the first workshop to steady-state operations.` unchanged.
- Keep the supporting paragraph beginning `JOTO brings planning...` unchanged.
- Render these six cards in this order: IT Planning & Consulting, Design & Deployment, 24×7 Support & Maintenance, Managed Security Services, Managed Outsourcing & Staffing, and IT Procurement.
- Use the supplied reference copy verbatim for each card.

## Visual direction

Use the reference site's six-card information architecture without copying its blue-purple styling. Cards remain native to the current JOTO V2 dark visual system, with green accents, restrained borders, square geometry, and existing reveal motion. Each card receives a distinct line icon. The grid is three columns on large screens, two on medium screens, and one on small screens.

## Data and accessibility

Service content remains centralized in `src/content/en.ts`. The service item type changes from bullet points to an icon identifier, title, and description. Icons are decorative and hidden from assistive technology; the six visible card headings provide the semantic labels. Cards have no false click affordance because they do not navigate.

## Verification

Add a focused component test that asserts the retained heading and description, new eyebrow, six card headings, absence of links, and section anchor. Run the full test suite and production build, then visually inspect desktop and mobile layouts.
