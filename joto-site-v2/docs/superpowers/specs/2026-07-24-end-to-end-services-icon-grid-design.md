# End-to-End Services Icon Grid Design

## Goal

Replace the image-heavy services cards with a compact dark six-cell line grid that communicates each service through a bold outline icon, title, and short description.

## Layout

- Desktop: three columns by two rows.
- Process order follows a snake path: Planning → Design → Procurement ↓ Outsourcing → Security → 24×7 Support.
- Visual positions are:
  - Top: Planning, Design, Procurement.
  - Bottom: 24×7 Support, Security, Outsourcing.
- Mobile keeps the logical process order as a single column.

## Visual treatment

- No service photography.
- Contiguous dark cells with restrained one-pixel borders.
- Large, thick-stroke outline icons in JOTO green.
- Short copy remains left aligned.
- Hover adds a slight lift, brighter border, and localized green glow.
- No arrows or loop symbol.

## Verification

- Component test asserts logical service order, six icons, and zero images.
- Production build must pass.
- Desktop visual review confirms the snake placement and compact card height.
