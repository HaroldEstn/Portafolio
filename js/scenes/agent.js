// GenAI agent scene: "Journey of a question". A proof-of-concept agent that
// answers questions about expense data. An ingest intro, then three questions
// take three different paths: a simple one (fast Haiku lane), a complex one
// (deeper Sonnet lane with memory) and an off-topic one blocked by Guardrails.
// No numbers are rendered anywhere in the scene.

import { applyTranslations, onLangChange, t } from '../i18n.js';
import { createRunner, svg } from '../util.js';

// Wires between nodes. `o` is the wire orientation on wide and narrow layouts:
// 'h' leaves the right side and enters the left side, 'v' bottom to top.
const EDGES = {
  ingest: { from: 'excel', to: 'etl', o: ['h', 'h'] },
  load: { from: 'etl', to: 'data', o: ['v', 'v'] },
  ask: { from: 'chat', to: 'guard', o: ['h', 'v'] },
  allow: { from: 'guard', to: 'router', o: ['h', 'v'] },
  toHaiku: { from: 'router', to: 'haiku', o: ['h', 'v'] },
  toSonnet: { from: 'router', to: 'sonnet', o: ['h', 'v'] },
  haikuTool: { from: 'haiku', to: 'tool1', o: ['h', 'v'] },
  sonnetTool1: { from: 'sonnet', to: 'tool1', o: ['h', 'v'] },
  sonnetTool2: { from: 'sonnet', to: 'tool2', o: ['h', 'v'] },
  tool1Data: { from: 'tool1', to: 'data', o: ['h', 'v'] },
  tool2Data: { from: 'tool2', to: 'data', o: ['h', 'v'] },
  store: { from: 'haiku', to: 'memory', o: ['v', 'h'] },
  recall: { from: 'memory', to: 'sonnet', o: ['v', 'h'] },
};

const BEATS = ['simple', 'complex', 'off'];
const WIDE = '(min-width: 980px)';
const GAP_BETWEEN_BEATS = 800;

const icon = {
  shield: '<svg class="agent__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/></svg>',
  excel: '<svg class="agent__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M12 3v18"/></svg>',
  data: '<svg class="agent__icon" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></svg>',
};

const node = (name, inner, cls = '') =>
  `<div class="agent__node agent__node--${name} ${cls}" data-node="${name}">${inner}</div>`;

const TEMPLATE = `
  <div class="agent">
    <header class="scene__head">
      <h3 data-i18n="agent.title">Journey of a question</h3>
      <p data-i18n="agent.sub">A proof-of-concept agent on Amazon Bedrock AgentCore answers questions about expense data, with guardrails and model routing.</p>
    </header>
    <div class="agent__diagram" data-role="diagram" role="img" data-i18n-aria="agent.diagramAlt" aria-label="Diagram of a question flowing from the chat through guardrails and a router to a fast Haiku lane or a deeper Sonnet lane, then to query tools and a data store, with agent memory alongside.">
      <svg class="agent__wires" data-role="wires" aria-hidden="true">
        <defs>
          <marker id="agent-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" class="agent__arrow"/></marker>
          <marker id="agent-arrow-lit" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" class="agent__arrow agent__arrow--lit"/></marker>
        </defs>
      </svg>
      ${node('excel', `${icon.excel}<span class="agent__label" data-i18n="agent.node.excel">Excel file</span>`)}
      ${node('etl', `<span class="agent__glyph" aria-hidden="true">&lambda;</span><span class="agent__label" data-i18n="agent.node.etl">Lambda ETL</span>`)}
      ${node(
        'chat',
        `<span class="agent__label" data-i18n="agent.node.chat">Chat</span><div class="agent__log" data-role="log" aria-hidden="true"></div>`,
      )}
      ${node(
        'guard',
        `${icon.shield}<span class="agent__label" data-i18n="agent.node.guard">Guardrails</span><span class="agent__hint" data-i18n="agent.guard.hint">Stays on expense data</span><span class="agent__badge" data-role="guard-state"></span>`,
      )}
      ${node('router', `<span class="agent__label" data-i18n="agent.node.router">Router</span><span class="agent__hint" data-i18n="agent.router.hint">By complexity</span>`)}
      ${node(
        'haiku',
        `<span class="agent__label" data-i18n="agent.node.haiku">Haiku</span><span class="agent__hint" data-i18n="agent.haiku.hint">fast and cheap</span><span class="agent__track agent__track--short"><span class="agent__fill" data-role="fill"></span></span>`,
      )}
      ${node(
        'memory',
        `<span class="agent__label" data-i18n="agent.node.memory">Memory</span><span class="agent__dots" data-role="dots"></span>`,
        'agent__node--soft',
      )}
      ${node(
        'sonnet',
        `<span class="agent__label" data-i18n="agent.node.sonnet">Sonnet</span><span class="agent__hint" data-i18n="agent.sonnet.hint">deeper reasoning</span><span class="agent__track agent__track--long"><span class="agent__fill" data-role="fill"></span></span>`,
      )}
      ${node('tool1', `<span class="agent__hint" data-i18n="agent.kicker.tool">Tool</span><span class="agent__label" data-i18n="agent.tool.spend">Spend by category</span>`)}
      ${node('tool2', `<span class="agent__hint" data-i18n="agent.kicker.tool">Tool</span><span class="agent__label" data-i18n="agent.tool.suppliers">Supplier trends</span>`)}
      ${node(
        'data',
        `${icon.data}<span class="agent__label" data-i18n="agent.node.data">Data store</span><span class="agent__rows" aria-hidden="true"><i></i><i></i><i></i></span>`,
      )}
    </div>
    <p class="agent__msg" data-role="msg" data-i18n="agent.msg.idle" aria-live="polite"></p>
    <div class="agent__beats" data-role="beats" role="group" data-i18n-aria="agent.beats" aria-label="Play one question type" inert>
      ${BEATS.map(
        (b) => `<button type="button" class="btn-small agent__beat" data-beat="${b}" data-i18n="agent.btn.${b}"></button>`,
      ).join('')}
    </div>
    <p class="agent__note" data-i18n="agent.note">Simplified view: sample questions and answers, no real data.</p>
  </div>`;

export default function createAgent() {
  const run = createRunner();
  const mq = window.matchMedia(WIDE);
  let root;
  let q;
  let nodes;
  let edges;
  let observer;
  let unsubLang = () => {};

  const lit = (...names) => names.forEach((n) => edges[n].line.classList.add('is-lit'));
  const on = (...names) => names.forEach((n) => nodes[n].classList.add('is-on'));

  /* ---- Geometry: wires follow the nodes, whatever the layout ------------- */
  function layout() {
    const d = q.diagram.getBoundingClientRect();
    if (!d.width) return;
    q.wires.setAttribute('viewBox', `0 0 ${d.width} ${d.height}`);
    const rel = (el) => {
      const r = el.getBoundingClientRect();
      return { l: r.left - d.left, r: r.right - d.left, t: r.top - d.top, b: r.bottom - d.top, w: r.width, h: r.height };
    };
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    Object.values(edges).forEach((e) => {
      const a = rel(nodes[e.from]);
      const b = rel(nodes[e.to]);
      let p;
      if (e.o[mq.matches ? 0 : 1] === 'h') {
        const ys = clamp(b.t + b.h / 2, a.t + 10, a.b - 10);
        p = [a.r, ys, b.l, clamp(ys, b.t + 10, b.b - 10)];
      } else {
        const xs = clamp(b.l + b.w / 2, a.l + 10, a.r - 10);
        p = [xs, a.b, clamp(xs, b.l + 10, b.r - 10), b.t];
      }
      [e.x1, e.y1, e.x2, e.y2] = p;
      e.line.setAttribute('x1', p[0]);
      e.line.setAttribute('y1', p[1]);
      e.line.setAttribute('x2', p[2]);
      e.line.setAttribute('y2', p[3]);
    });
  }

  /** A dot travelling along a wire (skipped under reduced motion). */
  function packet(name, ms, tone = '') {
    if (run.reduced || edges[name].x1 === undefined) return;
    const e = edges[name];
    const el = document.createElement('span');
    el.className = `agent__packet ${tone}`;
    q.diagram.appendChild(el);
    const at = (x, y) => `translate(${x - 5}px, ${y - 5}px)`;
    const anim = run.animate(
      el,
      [
        { transform: at(e.x1, e.y1), opacity: 0 },
        { transform: at(e.x1, e.y1), opacity: 1, offset: 0.12 },
        { transform: at(e.x2, e.y2), opacity: 1, offset: 0.88 },
        { transform: at(e.x2, e.y2), opacity: 0 },
      ],
      { duration: ms, easing: 'ease-in-out' },
    );
    anim.onfinish = () => el.remove();
  }

  /* ---- Chat log ----------------------------------------------------------- */
  function bubble(kind, key) {
    const el = document.createElement('div');
    el.className = `agent__bubble agent__bubble--${kind}`;
    el.dataset.i18n = key;
    el.textContent = t(key);
    q.log.appendChild(el);
    // Force a frame so the entry transition runs.
    requestAnimationFrame(() => el.classList.add('is-in'));
    if (run.reduced) el.classList.add('is-in');
  }

  function setMsg(key, final = false) {
    q.msg.dataset.i18n = key;
    q.msg.textContent = t(key);
    q.msg.classList.toggle('is-final', final);
  }

  function guard(state) {
    nodes.guard.classList.remove('is-checking', 'is-ok', 'is-block');
    if (state) nodes.guard.classList.add(`is-${state}`);
    const badge = q.guardState;
    if (state === 'ok' || state === 'block') {
      badge.dataset.i18n = `agent.guard.${state}`;
      badge.textContent = t(badge.dataset.i18n);
    } else {
      delete badge.dataset.i18n;
      badge.textContent = '';
    }
  }

  function addDot() {
    const dot = document.createElement('span');
    dot.className = 'agent__dot';
    q.dots.appendChild(dot);
    run.animate(dot, [{ transform: 'scale(0)' }, { transform: 'scale(1.5)', offset: 0.6 }, { transform: 'scale(1)' }], {
      duration: 500,
    });
  }

  function fill(laneName, ms) {
    run.animate(nodes[laneName].querySelector('[data-role="fill"]'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: ms,
      easing: 'linear',
    });
  }

  function flash(el) {
    el.classList.add('is-flash');
    run.after(700, () => el.classList.remove('is-flash'));
  }

  /* ---- State helpers ------------------------------------------------------ */
  // Clears the question flow (guardrails, router, lanes, tools, wires) but
  // keeps the ingest result and memory so a beat can follow another one.
  function resetFlow() {
    ['chat', 'guard', 'router', 'haiku', 'sonnet', 'tool1', 'tool2', 'memory'].forEach((n) => {
      nodes[n].classList.remove('is-on', 'is-checking', 'is-ok', 'is-block', 'is-flash');
    });
    ['ask', 'allow', 'toHaiku', 'toSonnet', 'haikuTool', 'sonnetTool1', 'sonnetTool2', 'tool1Data', 'tool2Data', 'store', 'recall'].forEach(
      (n) => edges[n].line.classList.remove('is-lit'),
    );
    guard(null);
    q.log.replaceChildren();
    root.querySelectorAll('.agent__packet').forEach((p) => p.remove());
  }

  function clearState() {
    root.querySelectorAll('.is-on, .is-lit, .is-flash, .is-active').forEach((el) => {
      el.classList.remove('is-on', 'is-lit', 'is-flash', 'is-active');
    });
    resetFlow();
    q.dots.replaceChildren();
    q.msg.classList.remove('is-final');
    setMsg('agent.msg.idle');
    setBeats(false);
  }

  function setBeats(visible) {
    q.beats.classList.toggle('is-on', visible);
    q.beats.inert = !visible;
  }

  function markBeat(name) {
    q.beatButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.beat === name));
  }

  /* ---- Beats: lists of [offset ms, action], returned with their length ----- */
  function ingestSteps() {
    return {
      length: 3000,
      steps: [
        [0, () => { setMsg('agent.msg.ingest'); on('excel'); }],
        [500, () => { lit('ingest'); packet('ingest', 700); }],
        [1200, () => on('etl')],
        [1700, () => { lit('load'); packet('load', 700); }],
        [2400, () => { on('data'); flash(nodes.data); }],
      ],
    };
  }

  const front = (msgKey, qKey) => [
    [0, () => { resetFlow(); setMsg(msgKey); on('chat'); bubble('user', qKey); }],
    [600, () => { lit('ask'); packet('ask', 600); nodes.guard.classList.add('is-checking'); }],
  ];

  const pass = (laneEdge, lane) => [
    [1250, () => { guard('ok'); on('guard'); lit('allow'); packet('allow', 500); }],
    [1800, () => on('router')],
    [2000, () => { lit(laneEdge); packet(laneEdge, 500); }],
    [2550, () => on(lane)],
  ];

  function simpleSteps() {
    return {
      length: 5000,
      steps: [
        ...front('agent.msg.simple', 'agent.q.simple'),
        ...pass('toHaiku', 'haiku'),
        [2600, () => fill('haiku', 900)],
        [2700, () => { lit('haikuTool'); packet('haikuTool', 500); }],
        [3250, () => { on('tool1'); lit('tool1Data'); packet('tool1Data', 500); }],
        [3800, () => { flash(nodes.data); bubble('bot', 'agent.a.simple'); }],
        [4200, () => { lit('store'); packet('store', 400); }],
        [4600, () => { on('memory'); addDot(); }],
      ],
    };
  }

  function complexSteps() {
    return {
      length: 5600,
      steps: [
        ...front('agent.msg.complex', 'agent.q.complex'),
        [0, () => { if (!q.dots.children.length) addDot(); }],
        ...pass('toSonnet', 'sonnet'),
        [2600, () => fill('sonnet', 1900)],
        [2700, () => { on('memory'); lit('recall'); packet('recall', 600); }],
        [3500, () => { lit('sonnetTool1', 'sonnetTool2'); packet('sonnetTool1', 500); packet('sonnetTool2', 500); }],
        [4050, () => { on('tool1', 'tool2'); lit('tool1Data', 'tool2Data'); packet('tool1Data', 500); packet('tool2Data', 500); }],
        [4600, () => { flash(nodes.data); bubble('bot', 'agent.a.complex'); }],
      ],
    };
  }

  function offSteps() {
    return {
      length: 3000,
      steps: [
        ...front('agent.msg.off', 'agent.q.off'),
        [1250, () => {
          guard('block');
          on('guard');
          run.animate(nodes.guard, [{ translate: '0' }, { translate: '-5px' }, { translate: '5px' }, { translate: '-3px' }, { translate: '0' }], {
            duration: 400,
            easing: 'ease-in-out',
          });
        }],
        [1900, () => bubble('blocked', 'agent.a.off')],
      ],
    };
  }

  const BEAT_BUILDERS = { simple: simpleSteps, complex: complexSteps, off: offSteps };

  // Schedules steps in chronological order (the order matters under reduced
  // motion, where `after()` runs everything immediately).
  function schedule(base, plan) {
    plan.steps
      .map((s, i) => [s, i])
      .sort((a, b) => a[0][0] - b[0][0] || a[1] - b[1])
      .forEach(([[at, fn]]) => run.after(base + at, fn));
    return base + plan.length;
  }

  /** Static end state: the three outcomes together. */
  function showSummary() {
    on('excel', 'etl', 'data', 'chat', 'guard', 'router', 'haiku', 'sonnet', 'tool1', 'tool2', 'memory');
    Object.keys(edges).forEach((n) => lit(n));
    guard('ok');
    q.dots.replaceChildren();
    addDot();
    q.log.replaceChildren();
    [['simple', 'user'], ['simple', 'bot'], ['complex', 'user'], ['complex', 'bot'], ['off', 'user'], ['off', 'blocked']].forEach(([beat, kind]) =>
      bubble(kind, `agent.${kind === 'user' ? 'q' : 'a'}.${beat}`),
    );
    q.log.classList.add('is-summary');
    setMsg('agent.msg.done', true);
    setBeats(true);
  }

  function playBeat(name) {
    run.cancel();
    clearState();
    q.log.classList.remove('is-summary');
    // A single beat starts from a ready system: data already ingested.
    on('excel', 'etl', 'data');
    lit('ingest', 'load');
    markBeat(name);
    setBeats(true);
    schedule(0, BEAT_BUILDERS[name]());
  }

  return {
    mount(el) {
      root = el;
      el.innerHTML = TEMPLATE;
      applyTranslations(el);
      q = {
        diagram: root.querySelector('[data-role="diagram"]'),
        wires: root.querySelector('[data-role="wires"]'),
        log: root.querySelector('[data-role="log"]'),
        guardState: root.querySelector('[data-role="guard-state"]'),
        dots: root.querySelector('[data-role="dots"]'),
        msg: root.querySelector('[data-role="msg"]'),
        beats: root.querySelector('[data-role="beats"]'),
        beatButtons: [...root.querySelectorAll('[data-beat]')],
      };
      nodes = Object.fromEntries([...root.querySelectorAll('[data-node]')].map((n) => [n.dataset.node, n]));
      edges = {};
      Object.entries(EDGES).forEach(([name, def]) => {
        const line = svg('line', { class: 'agent__wire' }, q.wires);
        edges[name] = { ...def, line };
      });
      q.beatButtons.forEach((b) => b.addEventListener('click', () => playBeat(b.dataset.beat)));
      observer = new ResizeObserver(layout);
      observer.observe(q.diagram);
      unsubLang = onLangChange(() => requestAnimationFrame(layout));
      clearState();
      layout();
    },

    play() {
      this.reset();
      layout();
      if (run.reduced) {
        showSummary();
        return;
      }
      let at = schedule(0, ingestSteps());
      BEATS.forEach((b) => {
        at += GAP_BETWEEN_BEATS;
        const mark = at;
        run.after(mark, () => markBeat(b));
        at = schedule(mark, BEAT_BUILDERS[b]());
      });
      run.after(at + 600, () => {
        markBeat(null);
        setMsg('agent.msg.done', true);
        setBeats(true);
      });
    },

    reset() {
      run.cancel();
      if (!root) return;
      q.log.classList.remove('is-summary');
      clearState();
    },

    destroy() {
      run.cancel();
      observer?.disconnect();
      unsubLang();
      root?.replaceChildren();
    },
  };
}
