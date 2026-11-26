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
- [x] T2 Keyboard (`js/keys.js`): j/k, h/l, 1-5, Space/Enter, r, gg/G, t, ?/Esc; statusline; help overlay. Route: delegated.
- [x] T3 Stage controller (`js/stage.js`) + Costs scene. Route: delegated.
- [x] T4 CI/CD scene with canary + rollback interaction. Route: delegated.
- [x] T4.1 Rework Costs scene (owner request 2026-11-26): generic cost-optimization waterfall with no visible figures. Bars sized from a 16000 baseline: voice agent -5000, EC2 rightsizing -600, EC2 scheduled stop/start -500, log retention -100. Short generic labels, no implementation detail (no Nova Sonic). Route: delegated (writer trigger: costs.js + i18n.js + styles).
- [x] T4.2 Rework CI/CD scene (owner request 2026-11-26): two versions, "current" at 100%, "new" arrives, current becomes "previous", traffic crossfades (one rises while the other falls). Keep `r` rollback (traffic returns to previous). Route: delegated (same writer as T4.1).
- [ ] T5 IaC, GenAI agent, AI tooling scenes. Route: delegated.
  - [x] T5.1 IaC scene "From code to cloud" (owner approved 2026-11-26): short CDK snippet types out; nested stack tree appears (parent stack -> network, compute ECS/Lambda, data RDS/DynamoDB/S3, monitoring alarms) lighting resources in dependency order; same tree stamped into dev/staging/prod. No digits anywhere (same rule as costs). Space replays; h/l optional env highlight only if it does not clash with scene navigation. Route: delegated (writer trigger: new scene + stage/i18n/styles/index).
  - [x] T5.2 GenAI agent scene "Journey of a question" (owner approved 2026-11-26): Excel -> ETL Lambda -> data store intro; simple question passes Guardrails, router sends to Haiku lane, one tool call, short answer, memory stores; complex question routed to Sonnet lane, two tools, memory provides context; off-topic question blocked by Guardrails with polite refusal. No digits; generic questions, no client name. Space replays; optional buttons to trigger each question type. Route: delegated (writer trigger: new scene + stage/i18n/styles/index).
  - [ ] T5.3 AI tooling scene.
- [x] T4.3 Replace the costs waterfall with per-category before/after bars (owner request 2026-11-26). Categories and reductions (used only for bar heights, no figures shown): voice agent -80%, query optimization -10%, log retention -60%, EC2 scheduled stop/start (24h to 8h) -65%. Supersedes the T4.1 waterfall; resolves review finding R3-002 (waterfall min-height drift). Route: delegated (writer trigger: costs.js + i18n.js + styles).
- [ ] T6 Polish: reduced motion, mobile layout, README. Also: review finding (lineage review-66fddcb42b5e2e09) R3-001 pipeline particles stay frozen mid-lane after reset; IaC env cards focusable/clickable while hidden (inert until revealed); IaC auto highlight toggles aria-pressed (use a non-pressed visual class). Route: delegated.

## Acceptance criteria
- No console/CSP errors; certifications load from `badges.json`.
- Every key in the keymap works and is ignored inside inputs or with modifiers.
- Scenes play when scrolled into view, replay on Space/Enter, `r` triggers rollback.
- EN/ES toggle covers all visible text.
- Reduced motion shows final static state; 375px layout usable by tap.

## Progress / Evidence
- T1 commit "feat: rebuild skeleton with vanilla ES modules, tighter CSP and new content" (SHA not self-referable; see git log). Checks: node --check js/*.js ok; headless CDP smoke test at 1280px and 375px: 17 cert cards rendered, no horizontal overflow, no CSP/JS errors, EN/ES toggle updates title, email assembled by JS. Note: badges.json has 17 badges while profile/hero says 14 certifications (unchanged).
- T2 commit "feat: add vim-style keyboard navigation, statusline and help overlay". Checks: node --check js/*.js ok; headless CDP key test: j/k/G/gg (500ms buffer)/t/?/Esc, Space/Enter suppressed on buttons/tabs, Ctrl ignored, statusline updates by section and language, stage events emitted (h/l/1-5/Space/Enter/r) for stage.js (T3) to consume; no console errors.
- T3 commit "feat: add stage controller and animated costs scene". Checks: node --check on all js/ files ok; headless CDP at 1280px and 375px: scene plays on entering viewport (KPI counts to -80%, DB card to -USD 600), no horizontal overflow, h/l/1-5/Space switch and replay scenes, statusline follows scene, EN/ES re-renders labels, no console errors; screenshots reviewed.
- T4 commit "feat: add animated CI/CD pipeline scene with failure injection and rollback". Checks: node --check on all js/ files ok; headless CDP at 1280px and 375px (vertical layout): token travels all stages, canary 10% to 100%, key r and button inject failure (spike, alarm, traffic to 0%, rollback path red then recovered), r from another scene switches to CI/CD, EN/ES relabels, no overflow, no console errors; reduced-motion emulation renders final states; chromium --dump-dom: 17 cert cards, no CSP errors.
- T4.1 commit "feat: rework costs scene as generic optimization waterfall". Checks: node --check on all js/ files ok; headless CDP at 1280px and 375px: waterfall plays (baseline, four steps with connectors and pulse, result bar), costs panel text has no digits (assert on textContent with the service name "EC2" excluded, since its "2" is part of the name), no overflow, EN/ES relabels, Space replays, reduced-motion emulation shows final static state, no console errors; screenshots reviewed. Thinnest steps use a 5-unit minimum bar height (log retention is otherwise about 1 unit). Removed old KPI, cards, schedule/retention widgets, tags and their i18n keys/CSS.
- T4.2 commit "feat: rework ci/cd scene as two-version traffic shift". Checks: node --check on all js/ files ok; headless CDP at 1280px and 375px: v1 Current 100%, v2 arrives (v1 relabels Previous, v2 New, 10% then 100% while v1 falls to 0%, then v2 Current), particles split between both lanes, key r injects failure (alarm, traffic back to v1 at 100% and v2 at 0%, v1 Current again, v2 Rolled back), r from the Costs scene switches to CI/CD, EN/ES relabels roles and panel title, no overflow, reduced-motion emulation renders the final state, no console errors; screenshots reviewed.

- Native review (T1–T4 range from 7fd7b48, medium risk, consent granted): approved and acknowledged, lens review-reliability. Non-blocking follow-ups: R3-001 hero says 14 certs vs 17 badges rendered; R3-002 last section (Contact) may never become current in statusline/j at page bottom; R3-003 help dialog lacks focus trap; R3-004 Space/Enter replay overrides native Space scroll everywhere; R3-005 no automated tests for deterministic logic.
- T4.3 commit "feat: show costs scene as per-category before/after bars". Checks: node --check on all js/ and js/scenes/ files ok; headless CDP at 1280px and 375px: after/before height ratios 0.2/0.9/0.4/0.35 exactly, costs panel textContent has no digits (strict, no exclusions, aria-label also digit-free), no horizontal overflow, Space replays (bars regrow from zero), EN/ES relabels, reduced-motion emulation renders the final state, no console or CSP errors; screenshots reviewed. Labels use 12px SVG text at 320 units wide (about 12px at 375px). Removed waterfall code, FINAL constant, and dead i18n keys (costs.baseline, step1-4, final) and CSS (links, halo, connectors).
- Native review (T4.1–T4.2 range from 931587f, medium risk, consent granted): approved and acknowledged, lens review-reliability. Non-blocking: R3-001 pipeline particles stay frozen mid-lane after reset (folded into T6); R3-002 waterfall min-height drift (superseded by T4.3).
- T5.1 commit "feat: add infrastructure as code scene". Checks: node --check on all js/ and js/scenes/ files ok; headless CDP at 1280px and 375px: scene reachable by key 3 and by h/l, statusline shows IaC, CDK snippet types out, stacks become active strictly in order Network, Compute, Data, Monitoring (MutationObserver), three env cards render (dev, staging, prod) with one highlight pass and click to highlight, Space replays from a clean state, panel textContent and aria-labels have no digits (strict; "S3" avoided by labelling it Buckets), EN/ES relabels (including mid-play), no horizontal overflow, smallest font 12px, reduced-motion emulation renders the final state, costs and CI/CD scenes still work, no console or CSP errors; screenshots reviewed. Removed the IaC "coming soon" placeholder from index.html.
- T5.2 commit "feat: add generative ai agent scene". Checks: node --check on all js/ and js/scenes/ files ok; headless CDP at 1280px and 375px: scene reachable by key 4 and by h/l, statusline shows GenAI agent; ingest then beats in order (MutationObserver): simple uses Haiku lane and one tool, complex uses Sonnet lane with Memory recall and two tools, off-topic turns Guardrails red (Blocked) and the router and lanes are never lit; each of the Simple/Complex/Off-topic buttons plays only its beat, Space and Enter replay the full sequence from ingest; beat buttons are inert and visibility hidden until the sequence ends (focus attempt fails), no aria-pressed; panel textContent and aria-labels have no digits in EN and ES; EN/ES relabels (including bubbles, badge, buttons); no horizontal overflow, smallest font 12px; reduced-motion emulation renders the summary (all three Q&A pairs, both lanes and both tools marked); costs, CI/CD and IaC scenes and key r still work; no console or CSP errors; screenshots reviewed. Wires are an SVG overlay recomputed from node rects (ResizeObserver), so one DOM serves the wide (980px and up) and vertical layouts. Removed the agent "coming soon" placeholder from index.html.

## Next step
Fold review follow-ups into T6, then T5.3 (AI tooling).
- Native review (T4.3–T5.1 range from a9ad4d8, medium risk, consent granted): approved and acknowledged, lens review-reliability. Non-blocking: env cards focusable while hidden; auto highlight toggles aria-pressed (both folded into T6); no unit tests for setTyped/colourize (TDD off, noted).
