# Slide + D3 Presentation Skeleton

This is a minimal, visually polished scaffold for doing a full presentation on the web with two kinds of pages:
- **Slide pages**: just HTML snippets you can edit quickly (`pages/slide-*.html`).
- **D3 pages**: standalone HTML files with their own JS/D3 logic, sandboxed in iframes (`pages/d3-*.html`).

The **parent** (`index.html`) controls scrolling, navigation, progress, keyboard shortcuts, and lazy loading.

## Quick start
Open `index.html` in a browser (double-click). Use ↑ / ↓ or the buttons to navigate. Dots on the right jump to any page. URL hash updates like `#/3` so you can deep-link.

## Add or reorder pages
In `index.html`, duplicate one of the `<section class="page" ...>` blocks and change:
- `data-type="slide"` or `data-type="d3"`
- `data-src` to your new file path under `pages/`

The parent lazy-loads the current page and its neighbors, so you can scale to many pages.

## Customize the look
Edit `assets/css/style.css`:
- Typography, colors, gradients (via CSS variables)
- Card look for slides and the iframe wrapper
- Scroll-snap behavior and reveal animation

## Keyboard & API
- Up/Down, PageUp/PageDown, Space: navigate
- `window.Deck.next()` / `window.Deck.prev()` / `window.Deck.goTo(n)` for scripting

## Alternatives
- If you prefer **no iframes** for D3 pages, convert them to slide pages and move their JS into inline `<script type="module">` within fetched HTML. Then tweak `ensureLoaded` in `assets/js/main.js` to execute scripts. The iframe route keeps isolation and avoids script-eval complexity.

Enjoy!
