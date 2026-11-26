// Impact stage: tab controller and scene lifecycle.
//
// Scene contract: createScene() returns { mount(el), play(), reset(), destroy?(), action?(name) }.
// A scene is mounted lazily the first time its tab is selected. The active
// scene plays whenever the stage enters the viewport and resets when it leaves.
//
// Events: listens to stage:select {id|delta}, stage:replay, stage:action {action};
//         emits stage:change {id}.

import createCosts from './scenes/costs.js';

const FACTORIES = {
  costs: createCosts,
};

// Which scene handles which keyboard action.
const ACTION_SCENE = { 'inject-failure': 'cicd' };

export function initStage() {
  const root = document.getElementById('stage');
  if (!root) return null;

  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const ids = tabs.map((t) => t.dataset.scene);
  const panels = new Map([...root.querySelectorAll('[role="tabpanel"]')].map((p) => [p.dataset.scene, p]));
  const instances = new Map(); // id -> scene instance
  let current = tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.dataset.scene ?? ids[0];
  let visible = false;

  const scene = (id) => instances.get(id);

  function ensureMounted(id) {
    if (instances.has(id) || !FACTORIES[id]) return;
    const instance = FACTORIES[id]();
    instance.mount(panels.get(id));
    instances.set(id, instance);
  }

  function select(id, { focus = false } = {}) {
    if (!ids.includes(id)) return;
    const previous = current;
    if (previous !== id) scene(previous)?.reset();
    current = id;

    tabs.forEach((tab) => {
      const on = tab.dataset.scene === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
    panels.forEach((panel, pid) => {
      panel.hidden = pid !== id;
    });

    ensureMounted(id);
    if (visible) scene(id)?.play();
    document.dispatchEvent(new CustomEvent('stage:change', { detail: { id } }));
  }

  const step = (delta) => select(ids[(ids.indexOf(current) + delta + ids.length) % ids.length]);

  function revealStage() {
    if (!visible) root.scrollIntoView({ behavior: 'auto', block: 'center' });
  }

  function replay() {
    revealStage();
    ensureMounted(current);
    scene(current)?.play();
  }

  function runAction(name) {
    const target = ACTION_SCENE[name] ?? current;
    revealStage();
    if (target !== current) select(target);
    ensureMounted(target);
    scene(target)?.action?.(name);
  }

  /* ---- Tabs: click and WAI-ARIA arrow keys ------------------------------ */
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => select(tab.dataset.scene));
    tab.addEventListener('keydown', (e) => {
      const i = ids.indexOf(tab.dataset.scene);
      const target =
        e.key === 'ArrowRight' ? ids[(i + 1) % ids.length]
        : e.key === 'ArrowLeft' ? ids[(i - 1 + ids.length) % ids.length]
        : e.key === 'Home' ? ids[0]
        : e.key === 'End' ? ids[ids.length - 1]
        : null;
      if (!target) return;
      e.preventDefault();
      select(target, { focus: true });
    });
  });

  document.getElementById('stage-replay')?.addEventListener('click', replay);

  /* ---- Keyboard events from keys.js ------------------------------------- */
  document.addEventListener('stage:select', (e) => {
    if (e.detail.id) select(e.detail.id);
    else if (e.detail.delta) step(e.detail.delta);
  });
  document.addEventListener('stage:replay', replay);
  document.addEventListener('stage:action', (e) => runAction(e.detail.action));

  /* ---- Play when in view, reset when out of view ------------------------ */
  ensureMounted(current);
  if ('IntersectionObserver' in window) {
    // Enter when a good share of the stage (or of the viewport, for tall
    // mobile layouts) is visible; leave only once it is fully out of view.
    new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        const enough =
          entry.isIntersecting &&
          (entry.intersectionRatio >= 0.35 || entry.intersectionRect.height >= window.innerHeight * 0.4);
        const next = visible ? entry.isIntersecting : enough;
        if (next === visible) return;
        visible = next;
        if (visible) scene(current)?.play();
        else scene(current)?.reset();
      },
      { threshold: [0, 0.1, 0.2, 0.35, 0.5] },
    ).observe(root);
  } else {
    visible = true;
    scene(current)?.play();
  }

  return { select, step, replay, runAction, get current() { return current; } };
}
