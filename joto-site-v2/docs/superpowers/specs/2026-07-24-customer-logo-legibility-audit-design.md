# Customer Logo Wall Legibility Audit Design

## Goal

Make every brand in the 42-logo customer wall immediately identifiable while preserving the single-row, continuously scrolling presentation.

## Audit findings

- The wall currently relies on image recognition alone; the fallback brand name appears only after an image-loading error.
- A global monochrome filter removes important internal contrast from some marks.
- Orange renders as an abstract square and bar rather than a readable Orange mark.
- FORVIA uses a low-resolution asset whose “O” reads as a solid circle.
- Yuwell and WuXi AppTec use icon-only or extremely small raster assets, so viewers cannot reliably identify the brands.
- Several other wordmarks remain technically present but become difficult to read at marquee size.

## Considered approaches

1. Replace every asset with a new full official wordmark and keep an image-only wall. This offers the strongest asset fidelity, but it introduces a large sourcing surface and remains vulnerable to small-size legibility.
2. Add names only to the four reported problem logos. This is visually minimal, but it keeps the audit subjective and allows other low-contrast assets to fail later.
3. Keep the verified logo assets, correct the visibly defective treatment, and add a consistent visible brand name to every item. This gives every one of the 42 entries an objective readable identifier and is resilient to image variation.

## Chosen design

Use approach 3.

- Every marquee item displays its existing logo and a small, high-contrast brand name underneath.
- Brand names use normal capitalization from the customer data rather than all caps, improving long-name readability.
- The primary marquee sequence exposes the logo alternative text; the duplicate sequence remains hidden from assistive technology.
- If an image fails, the brand name remains visible and the broken image disappears.
- Orange keeps its brand color and internal contrast instead of receiving the destructive monochrome filter.
- FORVIA, Yuwell, and WuXi AppTec receive dedicated treatment so their supplied marks are not forced into the same dimensions and filter behavior as full horizontal wordmarks.
- The item height increases only enough to accommodate the label; the marquee remains a single horizontal row and retains the current motion speed.

## Verification

- Unit tests confirm 42 accessible primary logos, 84 visible brand-name labels across primary and duplicate sequences, and fallback behavior.
- Content tests continue to confirm 42 unique local assets.
- Production build must pass.
- Browser review checks representative short, long, icon-only, contrast, and preserved-color marks at desktop and mobile widths.
- The final preview remains available at `/preview/customer-logo-wall`.
