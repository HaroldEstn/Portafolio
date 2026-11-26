// Costs scene: the voice-agent cost steps down with each optimization,
// ending at about -80% (the only real figure; middle steps are illustrative).

import { applyTranslations } from '../i18n.js';
import { createRunner, svg, lerp, clamp, easeInOutCubic } from '../util.js';

// Chart geometry (SVG user units).
const L = 48;
const R = 468;
const TOP = 24;
const BOTTOM = 232;
const W = 480;
const H = 276;
const DURATION = 4600;

const STEPS = [
  { key: 'costs.step1', value: 100, tag: 'baseline', label: '100%' },
  { key: 'costs.step2', value: 62, tag: 'illustrative', label: '~62%*' },
  { key: 'costs.step3', value: 38, tag: 'illustrative', label: '~38%*' },
  { key: 'costs.step4', value: 20, tag: 'real', label: '~20%' },
];
// Savings (100 - cost) at each step: 0, 38, 62, 80.
const SAVINGS = STEPS.map((s) => 100 - s.value);

const yOf = (v) => BOTTOM - (v / 100) * (BOTTOM - TOP);
const xOf = (i) => L + (i * (R - L)) / STEPS.length;

const TEMPLATE = `
  <div class="costs">
    <header class="scene__head">
      <h3 data-i18n="costs.title">Voice agent cost, step by step</h3>
      <p data-i18n="costs.sub">Each optimization swapped an expensive component for a cheaper one.</p>
    </header>
    <div class="costs__main">
      <div class="costs__chart-col">
        <div class="costs__kpi">
          <span class="costs__kpi-num" data-role="kpi">−0%</span>
          <span class="costs__kpi-label" data-i18n="costs.kpi">Estimated voice-agent cost reduction</span>
        </div>
        <svg class="costs__svg" data-role="chart" viewBox="0 0 ${W} ${H}" role="img" data-i18n-aria="costs.chartAlt" aria-label="Cost chart"></svg>
        <ol class="costs__steps" data-role="steps"></ol>
        <p class="costs__note" data-i18n="costs.note">* Intermediate values are illustrative.</p>
      </div>
      <div class="costs__cards">
        <article class="costs__card" data-role="card">
          <h4 data-i18n="costs.card1.title">Inefficient database queries</h4>
          <p class="costs__big"><span data-role="db-num">−USD 600</span> <span class="costs__unit" data-i18n="costs.perMonth">/ month</span></p>
          <p data-i18n="costs.card1.desc"></p>
        </article>
        <article class="costs__card" data-role="card">
          <h4 data-i18n="costs.card2.title">EC2 auto on/off schedule</h4>
          <div class="sched" data-role="sched" aria-hidden="true"></div>
          <p class="costs__tag" data-i18n="costs.card2.tag">illustrative schedule</p>
          <p data-i18n="costs.card2.desc"></p>
        </article>
        <article class="costs__card" data-role="card">
          <h4 data-i18n="costs.card3.title">Log retention tuning</h4>
          <div class="retention" aria-hidden="true"><div class="retention__fill" data-role="retention"></div></div>
          <p class="costs__tag" data-i18n="costs.tag.illustrative">illustrative</p>
          <p data-i18n="costs.card3.desc"></p>
        </article>
      </div>
    </div>
  </div>`;

export default function createCosts() {
  const run = createRunner();
  let root;
  let clipRect;
  let kpi;
  let dbNum;
  let markers = [];
  let legend = [];

  function build() {
    const chart = root.querySelector('[data-role="chart"]');

    const defs = svg('defs', {}, chart);
    const clip = svg('clipPath', { id: 'costs-reveal' }, defs);
    clipRect = svg('rect', { x: 0, y: 0, width: 0, height: H }, clip);

    // Grid and y axis.
    [0, 25, 50, 75, 100].forEach((v) => {
      svg('line', { x1: L, x2: R, y1: yOf(v), y2: yOf(v), class: 'costs__grid' }, chart);
      const label = svg('text', { x: L - 8, y: yOf(v) + 4, class: 'costs__axis', 'text-anchor': 'end' }, chart);
      label.textContent = `${v}%`;
    });

    // Baseline (initial cost).
    svg('line', { x1: L, x2: R, y1: yOf(100), y2: yOf(100), class: 'costs__baseline' }, chart);
    const baseLabel = svg('text', { x: R, y: yOf(100) - 6, class: 'costs__axis costs__axis--base', 'text-anchor': 'end' }, chart);
    baseLabel.dataset.i18n = 'costs.baseline';

    // Stepped line and the savings area between baseline and line.
    const pts = [];
    STEPS.forEach((s, i) => {
      pts.push([xOf(i), yOf(s.value)], [xOf(i + 1), yOf(s.value)]);
    });
    const linePath = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
    const area = [[L, yOf(100)], [R, yOf(100)], ...[...pts].reverse()];

    const clipped = svg('g', { 'clip-path': 'url(#costs-reveal)' }, chart);
    svg('polygon', { points: area.map((p) => p.join(',')).join(' '), class: 'costs__saving' }, clipped);
    svg('path', { d: linePath, class: 'costs__line', fill: 'none' }, clipped);

    // Numbered markers on each plateau.
    markers = STEPS.map((s, i) => {
      const cx = (xOf(i) + xOf(i + 1)) / 2;
      const cy = yOf(s.value);
      const g = svg('g', { class: `costs__marker costs__marker--${s.tag}` }, chart);
      svg('circle', { cx, cy, r: 11 }, g);
      const n = svg('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', class: 'costs__marker-n' }, g);
      n.textContent = String(i + 1);
      const v = svg('text', { x: cx, y: cy + 32, 'text-anchor': 'middle', class: 'costs__marker-v' }, g);
      v.textContent = s.label;
      return g;
    });

    // Legend, numbered like the markers.
    const list = root.querySelector('[data-role="steps"]');
    legend = STEPS.map((s, i) => {
      const li = document.createElement('li');
      li.className = 'costs__step';
      li.innerHTML = `<span class="costs__step-n">${i + 1}</span><span class="costs__step-label" data-i18n="${s.key}"></span><span class="tag tag--${s.tag}" data-i18n="costs.tag.${s.tag}"></span>`;
      list.appendChild(li);
      return li;
    });

    // EC2 schedule: 24 hourly cells, "on" during working hours (illustrative).
    const sched = root.querySelector('[data-role="sched"]');
    for (let h = 0; h < 24; h += 1) {
      const cell = document.createElement('span');
      cell.className = h >= 8 && h < 18 ? 'sched__cell sched__cell--on' : 'sched__cell';
      sched.appendChild(cell);
    }
  }

  function setProgress(p) {
    const f = p * STEPS.length;
    const index = clamp(Math.floor(f), 0, STEPS.length - 1);
    const local = f - index;

    clipRect.setAttribute('width', p <= 0 ? 0 : String(L + p * (R - L) + (p >= 1 ? 4 : 0)));

    // Savings counter eases toward the next step just before each drop.
    let saved = SAVINGS[index];
    if (index < STEPS.length - 1 && local > 0.8) {
      saved = lerp(saved, SAVINGS[index + 1], easeInOutCubic((local - 0.8) / 0.2));
    }
    kpi.textContent = `−${Math.round(saved)}%`;

    STEPS.forEach((_, i) => {
      const reached = p > 0 && f >= i + (i ? 0.05 : 0);
      markers[i].classList.toggle('is-on', reached);
      legend[i].classList.toggle('is-on', reached);
      legend[i].classList.toggle('is-current', reached && i === index);
    });
  }

  return {
    mount(el) {
      root = el;
      el.innerHTML = TEMPLATE;
      build();
      kpi = el.querySelector('[data-role="kpi"]');
      dbNum = el.querySelector('[data-role="db-num"]');
      applyTranslations(el);
      setProgress(0);
    },

    play() {
      this.reset();
      run.tween(DURATION, setProgress, { ease: easeInOutCubic });

      const cards = root.querySelectorAll('[data-role="card"]');
      cards.forEach((card, i) => {
        run.animate(
          card,
          [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
          { duration: 500, delay: 700 + i * 350 },
        );
      });

      // Count-up for the DB savings, starting with its card.
      run.after(900, () => {
        run.tween(1600, (p) => {
          dbNum.textContent = `−USD ${Math.round(600 * p)}`;
        }, { ease: (p) => 1 - Math.pow(1 - p, 3) });
      });

      // EC2 schedule: "on" hours light up one by one.
      root.querySelectorAll('.sched__cell--on').forEach((cell, i) => {
        run.animate(cell, [{ opacity: 0.1, transform: 'scaleY(0.2)' }, { opacity: 1, transform: 'scaleY(1)' }], {
          duration: 300,
          delay: 1400 + i * 60,
        });
      });

      // Log retention bar shrinks.
      run.animate(
        root.querySelector('[data-role="retention"]'),
        [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0.35)' }],
        { duration: 1400, delay: 1750, easing: 'ease-in-out' },
      );
    },

    reset() {
      run.cancel();
      if (!root) return;
      setProgress(0);
      dbNum.textContent = '−USD 0';
    },

    destroy() {
      run.cancel();
      root?.replaceChildren();
    },
  };
}
