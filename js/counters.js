// Hero counters: count up once when they scroll into view.

import { countUp, prefersReducedMotion } from './util.js';

function render(el, n) {
  el.textContent = `${el.dataset.prefix ?? ''}${Math.round(n)}${el.dataset.suffix ?? ''}`;
}

export function initCounters(root = document) {
  const els = [...root.querySelectorAll('.counter[data-count]')];
  const run = (el) =>
    countUp(el, Number(el.dataset.count), { format: (n) => `${el.dataset.prefix ?? ''}${Math.round(n)}${el.dataset.suffix ?? ''}` });

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => render(el, Number(el.dataset.count)));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target);
      });
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => {
    render(el, 0);
    io.observe(el);
  });
}
