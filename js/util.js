// Shared helpers: motion preference, rAF tweens, count-up, and a "runner"
// that tracks animations/timers so a scene can be reset and replayed cleanly.

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export const lerp = (a, b, p) => a + (b - a) * p;
export const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);
export const easeInOutCubic = (p) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

/**
 * Run fn(progress 0..1) every frame for `duration` ms.
 * With reduced motion, fn(1) runs once, synchronously.
 * Returns a cancel function.
 */
export function tween(duration, fn, { ease = (p) => p, reduced = prefersReducedMotion() } = {}) {
  if (reduced || duration <= 0) {
    fn(1);
    return () => {};
  }
  let raf = 0;
  let start = 0;
  const frame = (now) => {
    if (!start) start = now;
    const p = clamp((now - start) / duration, 0, 1);
    fn(ease(p));
    if (p < 1) raf = requestAnimationFrame(frame);
  };
  fn(0);
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/** Animate a number inside `el`. `format(n)` returns the text to show. */
export function countUp(el, to, { from = 0, duration = 1400, format = (n) => String(Math.round(n)) } = {}) {
  return tween(
    duration,
    (p) => {
      el.textContent = format(lerp(from, to, p));
    },
    { ease: easeOutCubic },
  );
}

/**
 * A runner owns everything a scene schedules (WAAPI animations, timers, rAF
 * tweens). `cancel()` wipes it all so `play()` can start from a clean state.
 * Under reduced motion, animations finish instantly and `after()` runs its
 * callback immediately, so a timeline written as nested `after()` calls
 * resolves straight to its final state.
 */
export function createRunner() {
  let animations = [];
  let timers = [];
  let cancels = [];

  return {
    get reduced() {
      return prefersReducedMotion();
    },
    animate(el, keyframes, options = {}) {
      const reduced = prefersReducedMotion();
      const anim = el.animate(keyframes, {
        fill: 'both',
        easing: 'ease-out',
        ...options,
        ...(reduced ? { duration: 0, delay: 0 } : {}),
      });
      if (reduced) anim.finish();
      animations.push(anim);
      return anim;
    },
    after(ms, fn) {
      if (prefersReducedMotion()) {
        fn();
        return 0;
      }
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    },
    every(ms, fn) {
      if (prefersReducedMotion()) return 0;
      const id = setInterval(fn, ms);
      timers.push(id);
      return id;
    },
    tween(duration, fn, options) {
      const cancel = tween(duration, fn, options);
      cancels.push(cancel);
      return cancel;
    },
    onCancel(fn) {
      cancels.push(fn);
    },
    cancel() {
      animations.forEach((a) => a.cancel());
      timers.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
      cancels.forEach((c) => c());
      animations = [];
      timers = [];
      cancels = [];
    },
  };
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Create an SVG element with attributes. */
export function svg(tag, attrs = {}, parent) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}
