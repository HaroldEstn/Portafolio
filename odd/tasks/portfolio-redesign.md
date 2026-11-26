# Feature: portfolio-redesign

## Objective
Rebuild the portfolio so achievements are shown through interactive animated "impact scenes" with Vim-style keyboard navigation, using the updated profile data.

## Problem / Why
Projects are static text cards with outdated data (4 years, "100+ templates", old email). The owner wants impact shown, not described (cost reduction chart, animated CI/CD flow) and keyboard-driven navigation (Neovim fan), without a CLI look.

## Scope
- One-page site: Hero, Impact stage (Costs, CI/CD, IaC, GenAI agent, AI tooling), Experience, Skills, Certifications, Contact.
- Vanilla HTML/CSS/ES modules, inline SVG, Web Animations API. No build step.
- Remove Bootstrap, jQuery, Popper, bootstrap-icons. Tighten CSP.
- EN/ES i18n kept.

## Constraints
- Source of truth for content: `~/Downloads/Harold_Gamboa_informacion_general.md` (do not publish salary, availability or "Datos para postulaciones").
- Only real figures: final ~80% voice-agent cost reduction, ~USD 600/month DB fix. Intermediate cost steps labelled "illustrative".
- Deploy stays static (S3 pipeline copies repo files).
- `prefers-reduced-motion` respected; mouse/touch parity with keyboard.

## TDD
Mode: off. Source: no project/session TDD config and no test runner. Checks: `node --check` on JS modules, local `python3 -m http.server` smoke test, headless Chromium console/CSP check when available, manual browser verification.

## Delivery
Strategy: ask-on-risk. Forecast > 400 authored lines (full rewrite), single feature branch `feat/portfolio-redesign`; slicing decision pending if a PR is requested.

## Tasks
- [x] T1 Skeleton: new `index.html`/`styles.css`, remove CDN deps, CSP, move certs/contact/i18n to `js/`, new content. Route: delegated (writer trigger, 2+ non-trivial files).
- [ ] T2 Keyboard (`js/keys.js`): j/k, h/l, 1-5, Space/Enter, r, gg/G, t, ?/Esc; statusline; help overlay. Route: delegated.
- [ ] T3 Stage controller (`js/stage.js`) + Costs scene. Route: delegated.
- [ ] T4 CI/CD scene with canary + rollback interaction. Route: delegated.
- [ ] T5 IaC, GenAI agent, AI tooling scenes. Route: delegated.
- [ ] T6 Polish: reduced motion, mobile layout, README. Route: delegated.

## Acceptance criteria
- No console/CSP errors; certifications load from `badges.json`.
- Every key in the keymap works and is ignored inside inputs or with modifiers.
- Scenes play when scrolled into view, replay on Space/Enter, `r` triggers rollback.
- EN/ES toggle covers all visible text.
- Reduced motion shows final static state; 375px layout usable by tap.

## Progress / Evidence
- T1 commit "feat: rebuild skeleton with vanilla ES modules, tighter CSP and new content" (SHA not self-referable; see git log). Checks: node --check js/*.js ok; headless CDP smoke test at 1280px and 375px: 17 cert cards rendered, no horizontal overflow, no CSP/JS errors, EN/ES toggle updates title, email assembled by JS. Note: badges.json has 17 badges while profile/hero says 14 certifications (unchanged).
(T2-T4 entries below)

## Next step
T1–T4 (first deliverable).
