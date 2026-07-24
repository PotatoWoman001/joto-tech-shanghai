# Solution Hero Logo Balance Design

## Goal

Apply the two approved browser comments consistently to every Solution detail page without changing the homepage or any non-Solution page.

## Design

- Remove the repeated `{partnerName} × JOTO` line between the logo lockup and the hero title.
- Keep the relationship-section eyebrow unchanged because it labels that section rather than duplicating the hero lockup.
- Reduce the vendor logo limit from 40 px high / 180 px wide to 32 px high / 140 px wide so its visual weight is closer to the JOTO wordmark.
- Restore intentional breathing room by applying the hero title margin directly after the logo lockup.
- Implement only in the shared `PartnerDetailPage` so all 20 vendor pages receive identical behavior.

## Verification

- Update component tests to assert one remaining vendor/JOTO relationship label and the new shared logo constraints.
- Run the Partner detail test, full test suite, and production build.
- Inspect the Extreme Networks page at desktop and mobile widths in the browser.
