// AI tooling scene: "One toolbox, many assistants". A repetitive task is slow
// and token-hungry; custom skills and MCP servers are assembled into one hub
// that every coding assistant plugs into; the same task then collapses into a
// single skill run. No numbers are rendered anywhere in the scene.

import { applyTranslations, onLangChange, t } from '../i18n.js';
import { createRunner, svg } from '../util.js';

const STEPS = ['gather', 'copy', 'configure', 'validate'];
const ASSISTANTS = ['Claude', 'Codex', 'Kiro', 'Antigravity'];

// Timeline (ms).
const BEFORE_TICK_AT = 700;
const BEFORE_TICK_STEP = 1000;
const BEFORE_FILL_MS = 4600;
const BUILD_AT = 5100;
const PIECE_STEP = 450;
const HUB_DONE_AT = BUILD_AT + 1300;
const CONNECT_AT = HUB_DONE_AT + 300;
const CONNECT_STEP = 450;
const AFTER_AT = CONNECT_AT + ASSISTANTS.length * CONNECT_STEP + 700;
const COLLAPSE_AT = AFTER_AT + 900;
const AFTER_FILL_AT = COLLAPSE_AT + 300;
const AFTER_FILL_MS = 700;
const FINAL_AT = AFTER_FILL_AT + AFTER_FILL_MS + 500;

const TOKENS_HIGH = 0.94;
const TOKENS_LOW = 0.16;

const steps = (cls) =>
  STEPS.map(
    (s) => `<li class="tool__step" data-role="${cls}-step"><span class="tool__tick" aria-hidden="true"></span><span data-i18n="tool.step.${s}"></span></li>`,
  ).join('');

const meters = (cls) => `
  <div class="tool__meter">
    <div class="tool__meter-head"><span data-i18n="tool.time">Time</span><strong data-role="${cls}-time" class="tool__word"></strong></div>
    <div class="tool__track tool__track--time-${cls}" aria-hidden="true"><span class="tool__fill" data-role="${cls}-timefill"></span></div>
  </div>
  <div class="tool__meter">
    <div class="tool__meter-head"><span data-i18n="tool.tokens">Token use</span><strong data-role="${cls}-level" class="tool__word"></strong></div>
    <div class="tool__track" aria-hidden="true"><span class="tool__fill tool__fill--tokens" data-role="${cls}-tokenfill"></span></div>
  </div>`;

const TEMPLATE = `
  <div class="tool">
    <header class="scene__head">
      <h3 data-i18n="tool.title">One toolbox, many assistants</h3>
      <p data-i18n="tool.sub">Custom skills and MCP servers built once for coding assistants cut token use and automate repetitive work.</p>
    </header>
    <div class="tool__grid">
      <section class="tool__card" data-role="before" aria-labelledby="tool-before-h">
        <h4 class="tool__kicker" id="tool-before-h" data-i18n="tool.before">Before: by hand</h4>
        <p class="tool__task" data-i18n="tool.task">Repetitive task</p>
        <ol class="tool__steps">${steps('before')}</ol>
        ${meters('before')}
      </section>
      <section class="tool__box" data-role="box" aria-labelledby="tool-box-h">
        <h4 class="tool__kicker" id="tool-box-h" data-i18n="tool.box">The toolbox</h4>
        <div class="tool__diagram" data-role="diagram" role="img" data-i18n-aria="tool.diagramAlt" aria-label="Diagram of a toolbox hub built from skills and MCP servers, connected to four coding assistants: Claude, Codex, Kiro and Antigravity.">
          <svg class="tool__wires" data-role="wires" aria-hidden="true">
            <defs>
              <marker id="tool-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" class="tool__arrow"/></marker>
              <marker id="tool-arrow-lit" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" class="tool__arrow tool__arrow--lit"/></marker>
            </defs>
          </svg>
          <div class="tool__hub" data-role="hub">
            <span class="tool__hub-name" data-i18n="tool.hub">Toolbox</span>
            <span class="tool__piece tool__piece--skills" data-role="piece" data-i18n="tool.skills">Skills</span>
            <span class="tool__piece tool__piece--mcp" data-role="piece" data-i18n="tool.mcp">MCP servers</span>
          </div>
          <div class="tool__assistants">
            ${ASSISTANTS.map(
              (a) => `<div class="tool__assistant" data-role="assistant"><span class="tool__dot" aria-hidden="true"></span><span class="tool__aname">${a}</span><span class="tool__conn" data-i18n="tool.connected">Connected</span></div>`,
            ).join('')}
          </div>
        </div>
      </section>
      <section class="tool__card tool__card--after" data-role="after" aria-labelledby="tool-after-h">
        <h4 class="tool__kicker" id="tool-after-h" data-i18n="tool.after">After: with the toolbox</h4>
        <p class="tool__task" data-i18n="tool.task">Repetitive task</p>
        <ol class="tool__steps">
          ${steps('after')}
          <li class="tool__step tool__step--skill" data-role="skillrun"><span class="tool__tick" aria-hidden="true"></span><span data-i18n="tool.skillrun">Skill run</span></li>
        </ol>
        ${meters('after')}
      </section>
    </div>
    <p class="tool__msg" data-role="msg" data-i18n="tool.msg.idle" aria-live="polite"></p>
    <p class="tool__note" data-i18n="tool.note">Simplified view: the exact skills and servers vary by task.</p>
  </div>`;

export default function createTooling() {
  const run = createRunner();
  let root;
  let q;
  let unsubLang = () => {};
  let observer;
  let edges = [];

  const all = (role) => [...root.querySelectorAll(`[data-role="${role}"]`)];

  function setMsg(key, final = false) {
    q.msg.dataset.i18n = key;
    q.msg.textContent = t(key);
    q.msg.classList.toggle('is-final', final);
  }

  function setWord(el, key) {
    if (key) {
      el.dataset.i18n = key;
      el.textContent = t(key);
    } else {
      delete el.dataset.i18n;
      el.textContent = '';
    }
  }

  const fillTo = (el, to, ms) =>
    run.animate(el, [{ transform: 'scaleX(0)' }, { transform: `scaleX(${to})` }], { duration: ms, easing: 'linear' });

  /* ---- Geometry: wires run from the hub to each assistant ------------------ */
  function layout() {
    const d = q.diagram.getBoundingClientRect();
    if (!d.width) return;
    q.wires.setAttribute('viewBox', `0 0 ${d.width} ${d.height}`);
    const h = q.hub.getBoundingClientRect();
    edges.forEach((line, i) => {
      const a = q.assistants[i].getBoundingClientRect();
      line.setAttribute('x1', h.right - d.left);
      line.setAttribute('y1', h.top - d.top + h.height / 2);
      line.setAttribute('x2', a.left - d.left);
      line.setAttribute('y2', a.top - d.top + a.height / 2);
    });
  }

  /* ---- States ------------------------------------------------------------- */
  function clearState() {
    root.querySelectorAll('.is-on, .is-done, .is-lit, .is-faded, .is-collapsed, .is-built').forEach((el) => {
      el.classList.remove('is-on', 'is-done', 'is-lit', 'is-faded', 'is-collapsed', 'is-built');
    });
    ['before', 'after'].forEach((k) => {
      setWord(q[`${k}Time`], null);
      setWord(q[`${k}Level`], null);
    });
    setMsg('tool.msg.idle');
  }

  const startBefore = () => {
    q.before.classList.add('is-on');
    setMsg('tool.msg.before');
    setWord(q.beforeTime, 'tool.hours');
    setWord(q.beforeLevel, 'tool.high');
    fillTo(q.beforeTimeFill, 1, BEFORE_FILL_MS);
    fillTo(q.beforeTokenFill, TOKENS_HIGH, BEFORE_FILL_MS);
  };

  const startAfter = () => {
    q.before.classList.add('is-faded');
    q.after.classList.add('is-on');
    setMsg('tool.msg.after');
  };

  const collapse = () => {
    q.afterSteps.forEach((s) => s.classList.add('is-collapsed'));
    q.skillrun.classList.add('is-on', 'is-done');
    setWord(q.afterTime, 'tool.minutes');
    setWord(q.afterLevel, 'tool.low');
    fillTo(q.afterTimeFill, 1, AFTER_FILL_MS);
    fillTo(q.afterTokenFill, TOKENS_LOW, AFTER_FILL_MS);
  };

  function connect(i) {
    q.assistants[i].classList.add('is-on');
    edges[i].classList.add('is-lit');
  }

  function build(i) {
    q.pieces[i].classList.add('is-on');
  }

  return {
    mount(el) {
      root = el;
      el.innerHTML = TEMPLATE;
      applyTranslations(el);
      q = {
        before: root.querySelector('[data-role="before"]'),
        after: root.querySelector('[data-role="after"]'),
        box: root.querySelector('[data-role="box"]'),
        diagram: root.querySelector('[data-role="diagram"]'),
        wires: root.querySelector('[data-role="wires"]'),
        hub: root.querySelector('[data-role="hub"]'),
        pieces: all('piece'),
        assistants: all('assistant'),
        beforeSteps: all('before-step'),
        afterSteps: all('after-step'),
        skillrun: root.querySelector('[data-role="skillrun"]'),
        beforeTime: root.querySelector('[data-role="before-time"]'),
        afterTime: root.querySelector('[data-role="after-time"]'),
        beforeLevel: root.querySelector('[data-role="before-level"]'),
        afterLevel: root.querySelector('[data-role="after-level"]'),
        beforeTimeFill: root.querySelector('[data-role="before-timefill"]'),
        afterTimeFill: root.querySelector('[data-role="after-timefill"]'),
        beforeTokenFill: root.querySelector('[data-role="before-tokenfill"]'),
        afterTokenFill: root.querySelector('[data-role="after-tokenfill"]'),
        msg: root.querySelector('[data-role="msg"]'),
      };
      edges = ASSISTANTS.map(() => svg('line', { class: 'tool__wire' }, q.wires));
      observer = new ResizeObserver(layout);
      observer.observe(q.diagram);
      unsubLang = onLangChange(() => requestAnimationFrame(layout));
      clearState();
      layout();
    },

    play() {
      this.reset();
      layout();
      // Before: manual steps tick slowly while time and tokens climb.
      run.after(0, startBefore);
      q.beforeSteps.forEach((s, i) => run.after(BEFORE_TICK_AT + i * BEFORE_TICK_STEP, () => s.classList.add('is-done')));
      // Toolbox: pieces assemble into the hub, then each assistant connects.
      run.after(BUILD_AT, () => {
        q.box.classList.add('is-on');
        q.hub.classList.add('is-on');
        setMsg('tool.msg.box');
      });
      q.pieces.forEach((_, i) => run.after(BUILD_AT + 200 + i * PIECE_STEP, () => build(i)));
      run.after(HUB_DONE_AT, () => q.hub.classList.add('is-built'));
      ASSISTANTS.forEach((_, i) => run.after(CONNECT_AT + i * CONNECT_STEP, () => connect(i)));
      // After: the same task, one skill run.
      run.after(AFTER_AT, startAfter);
      run.after(COLLAPSE_AT, collapse);
      run.after(FINAL_AT, () => setMsg('tool.msg.done', true));
      // Under reduced motion every `after` above ran in order, leaving the final state.
    },

    reset() {
      run.cancel();
      if (root) clearState();
    },

    destroy() {
      run.cancel();
      observer?.disconnect();
      unsubLang();
      root?.replaceChildren();
    },
  };
}
