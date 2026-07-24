# Language Selector Design

## Goal

Replace the permanently visible three-language pill with a discreet current-language menu and choose a sensible language on first visit.

## Behaviour

- The header shows only the active language and a chevron.
- Activating the control opens a three-item menu for English, Chinese and Persian.
- The menu closes after selection, outside pointer interaction, or Escape.
- A manual selection is stored in `localStorage` and takes precedence on later visits.
- On an unprefixed first visit with no stored choice, `navigator.languages` selects Chinese for `zh-*`, Persian for `fa-*`, and English otherwise.
- Explicit `/zh` and `/fa` URLs are always respected.
- Persian remains available to relevant visitors without being permanently exposed in the navigation.

## Accessibility and responsive behaviour

- The trigger exposes `aria-haspopup`, `aria-expanded`, and an accessible language-selector label.
- The menu uses semantic links and marks the current locale with `aria-current`.
- The same compact control is used across desktop and mobile header widths.
- Focus styling and reduced-motion conventions match the existing header.

