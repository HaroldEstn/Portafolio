# Harold Gamboa - Portfolio

One-page portfolio with interactive "impact scenes" and optional Vim-style keyboard navigation. Sections: Hero, Impact, Experience, Skills, Certifications, Contact. English and Spanish.

## Tech

- Vanilla HTML, CSS and ES modules. No framework, no bundler, no build step.
- Inline SVG and the Web Animations API for the scenes.
- Strict Content Security Policy (`script-src 'self'`): no inline scripts, no third-party scripts.

## Project structure

```
index.html        Page markup and CSP
styles.css        All styles
badges.json       Credly export that feeds the certifications
js/
  main.js         Entry point, wires every module
  stage.js        Impact stage: tabs and scene lifecycle
  keys.js         Keyboard navigation, statusline, help dialog
  i18n.js         EN/ES strings and language toggle
  certs.js        Certifications grid
  marquee.js      Rotating certification badges in the hero
  counters.js, contact.js, util.js
  scenes/         One module per impact scene
odd/              Feature task tracking for the redesign
```

## Run locally

```sh
python3 -m http.server
```

Open http://localhost:8000. Any static server works; ES modules and `badges.json` need HTTP, so opening `index.html` from disk will not work.

## Keyboard shortcuts

Shortcuts are optional; everything also works with mouse and touch. They are ignored inside form fields and with Ctrl/Alt/Meta.

| Keys | Action |
| --- | --- |
| `j` / `k` | Scroll down / up |
| `d` / `u` | Half page down / up |
| `}` / `{` | Next / previous section |
| `gg` / `G` | Top / bottom of the page |
| `h` / `l` | Previous / next scene |
| `1`-`5` | Jump to a scene |
| `Space` / `Enter` | Replay the current scene (only while the Impact section is in view; elsewhere `Space` scrolls natively) |
| `r` | Inject a failure in the CI/CD scene |
| `t` | Toggle English / Spanish |
| `?` / `Esc` | Open / close the help dialog |

## Accessibility

- `prefers-reduced-motion`: scenes render their final state and the marquee stops.
- Full keyboard access: tabs follow the WAI-ARIA tab pattern (arrow keys, Home, End); the help dialog traps focus and restores it on close.
- Scenes carry accessible labels (EN and ES).

## Content

- UI text lives in `js/i18n.js` (EN and ES). Static markup uses `data-i18n` attributes; scenes use `t()`.
- Certifications come from `badges.json`. Replace it with a fresh Credly export to update them.
- Content rule: scenes show no numeric figures.

## Deployment

The site is static: the repository files are copied as-is to S3 by an AWS pipeline. The pipeline definition (including its build spec) is managed outside this repository, so there is nothing to build or configure here.
