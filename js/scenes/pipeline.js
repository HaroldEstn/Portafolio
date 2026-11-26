// CI/CD scene: a token travels Push -> Unit tests -> SonarQube -> Build & push
// ECR -> Canary deploy -> Monitoring. Two versions serve traffic: v1 starts as
// "Current" at 100%; when v2 arrives v1 becomes "Previous" and traffic shifts
// gradually to v2 (particles split between both). "Inject failure" (button or
// key r) makes the error metric spike, the alarm fire, traffic shift back to v1
// and the rollback path light up before everything recovers.

import { applyTranslations, onLangChange, t } from '../i18n.js';
import { createRunner, svg, lerp, easeInOutCubic, clamp } from '../util.js';

const STAGES = [
  { title: 'pipeline.n1', sub: 'pipeline.s1' },
  { title: 'pipeline.n2' },
  { title: 'pipeline.n3' },
  { title: 'pipeline.n4', sub: 'pipeline.s4' },
  { title: 'pipeline.n5', sub: 'pipeline.s5' },
  { title: 'pipeline.n6', sub: 'pipeline.s6' },
];
const CANARY = 4;
const MONITOR = 5;
const MESSAGES = ['push', 'test', 'sonar', 'build', 'canary', 'monitor'];

// Traffic flow: two lanes (v1, v2) drawn as cubic curves from the source.
const LANES = [
  { y: 16, cls: 'v1' },
  { y: 68, cls: 'v2' },
];
const FLOW_FROM = { x: 30, y: 42 };
const FLOW_TO_X = 232;
const POOL = 36;
const flowPoint = (lane, p) => {
  const x0 = FLOW_FROM.x;
  const y0 = FLOW_FROM.y;
  const mid = 130;
  const q = 1 - p;
  return {
    x: q ** 3 * x0 + 3 * q * q * p * mid + 3 * q * p * p * mid + p ** 3 * FLOW_TO_X,
    y: q ** 3 * y0 + 3 * q * q * p * y0 + 3 * q * p * p * lane.y + p ** 3 * lane.y,
  };
};

const SAMPLES = 48;
const BASE_ERR = 8;
const SPIKE_ERR = 88;
const ALARM_AT = 50;

const TEMPLATE = `
  <div class="pl">
    <header class="scene__head pl__head">
      <div>
        <h3 data-i18n="pipeline.title">From push to production, with automatic rollback</h3>
        <p data-i18n="pipeline.sub">A pipeline with unit tests, SonarQube and image builds, then Lambda canary deployments with CodeDeploy.</p>
      </div>
      <button type="button" class="btn-small btn-small--danger" data-role="fail">
        <span data-i18n="pipeline.inject">Inject failure</span> <kbd>r</kbd>
      </button>
    </header>
    <div class="pl__diagram" data-role="diagram"></div>
    <p class="pl__msg" data-role="msg" aria-live="polite" data-i18n="pipeline.msg.idle">Ready.</p>
    <div class="pl__panels">
      <section class="pl__panel">
        <h4 data-i18n="pipeline.traffic.title">Traffic by version</h4>
        <svg class="pl__flow" data-role="flow" viewBox="0 0 300 84" aria-hidden="true"></svg>
        <div class="pl__ver" data-role="ver-v1">
          <span class="pl__ver-name">v1</span>
          <span class="pl__ver-role" data-role="role-v1"></span>
          <span class="pl__ver-pct" data-role="pct-v1">100%</span>
          <div class="pl__bar" aria-hidden="true"><div class="pl__bar-fill" data-role="fill-v1"></div></div>
        </div>
        <div class="pl__ver" data-role="ver-v2">
          <span class="pl__ver-name">v2</span>
          <span class="pl__ver-role" data-role="role-v2"></span>
          <span class="pl__ver-pct" data-role="pct-v2">0%</span>
          <div class="pl__bar" aria-hidden="true"><div class="pl__bar-fill" data-role="fill-v2"></div></div>
        </div>
      </section>
      <section class="pl__panel">
        <div class="pl__panel-head">
          <h4 data-i18n="pipeline.metric.title">Error rate (CloudWatch)</h4>
          <span class="pl__chip pl__chip--ok" data-role="alarm" data-i18n="pipeline.alarm.ok">Alarm: OK</span>
        </div>
        <svg class="pl__spark" data-role="spark" viewBox="0 0 240 70" role="img" data-i18n-aria="pipeline.metric.title" aria-label="Error rate">
          <line class="pl__threshold" x1="0" x2="240" y1="0" y2="0" data-role="threshold"/>
          <polygon class="pl__spark-area" data-role="spark-area" points=""/>
          <polyline class="pl__spark-line" data-role="spark-line" points=""/>
        </svg>
        <p class="pl__spark-label"><span class="pl__threshold-key" aria-hidden="true"></span><span data-i18n="pipeline.metric.threshold">Alarm threshold</span></p>
      </section>
    </div>
    <p class="pl__note" data-i18n="pipeline.note">Simulation: a simplified view of the real pipeline.</p>
  </div>`;

export default function createPipeline() {
  const run = createRunner();
  let root;
  let diagramEl;
  let msgEl;
  let alarmEl;
  let failBtn;
  let flowEl;
  let ver = []; // [{ box, role, pct, fill }] for v1, v2
  let lanes = [];
  let boxes = [];
  let pool = [];
  let acc = [0, 0];
  let sparkLine;
  let sparkArea;
  let unsubLang = () => {};
  let mq;
  let onMq;

  // Model: the diagram is rebuilt on layout change, so state lives here.
  const model = {
    states: STAGES.map(() => 'idle'), // idle | running | ok | fail
    links: STAGES.map(() => false),
    rollback: 'off', // off | active | done
    tokenAt: 0,
    tokenVisible: false,
    traffic: 0, // share of traffic on v2 (v1 gets the rest)
    roles: ['current', 'none'], // v1, v2: none | new | current | previous | failed
    msg: 'idle',
    alarm: false,
  };
  let phase = 'idle'; // idle | running | live | failing
  let pendingFailure = false;
  let failRequestedAt = -Infinity;
  let samples = [];
  let errTarget = BASE_ERR;
  let errNow = BASE_ERR;

  // Diagram elements, rebuilt with the layout.
  let nodes = [];
  let links = [];
  let rollbackEls = [];
  let token = null;
  let centers = [];

  const vertical = () => !window.matchMedia('(min-width: 760px)').matches;

  /* ---- Diagram -------------------------------------------------------- */
  function setTitle(node, key, isVertical, cx, y0) {
    const lines = t(key).split('\n');
    node.title.replaceChildren();
    if (isVertical) {
      node.title.textContent = lines.join(' ');
      return;
    }
    const first = y0 - (lines.length - 1) * 8;
    lines.forEach((line, i) => {
      const span = svg('tspan', { x: cx, y: first + i * 16 });
      span.textContent = line;
      node.title.appendChild(span);
    });
  }

  function relabel() {
    const isV = vertical();
    nodes.forEach((node, i) => {
      setTitle(node, STAGES[i].title, isV, node.cx, node.titleY);
      if (node.sub) node.sub.textContent = t(STAGES[i].sub);
    });
    rollbackEls.label && (rollbackEls.label.textContent = t('pipeline.rollback'));
    applyRoles();
  }

  function buildDiagram() {
    const isV = vertical();
    diagramEl.replaceChildren();

    const W = isV ? 350 : 760;
    const H = isV ? 452 : 176;
    const diagram = svg('svg', {
      class: `pl__svg pl__svg--${isV ? 'v' : 'h'}`,
      viewBox: `0 0 ${W} ${H}`,
      role: 'img',
    }, diagramEl);
    diagram.dataset.i18nAria = 'pipeline.diagramAlt';

    const nw = isV ? 270 : 112;
    const nh = isV ? 56 : 88;
    const rects = STAGES.map((_, i) =>
      isV ? { x: 16, y: 8 + i * (nh + 20) } : { x: 4 + i * 128, y: 16 },
    );
    centers = rects.map((r) => ({ x: r.x + nw / 2, y: r.y + nh / 2 }));

    // Links under the nodes.
    links = STAGES.slice(0, -1).map((_, i) => {
      const a = rects[i];
      const b = rects[i + 1];
      const attrs = isV
        ? { x1: a.x + nw / 2, y1: a.y + nh, x2: b.x + nw / 2, y2: b.y }
        : { x1: a.x + nw, y1: a.y + nh / 2, x2: b.x, y2: b.y + nh / 2 };
      return {
        base: svg('line', { ...attrs, class: 'pl__link' }, diagram),
        fill: svg('line', { ...attrs, class: 'pl__link pl__link--fill' }, diagram),
      };
    });

    // Rollback path: Monitoring back to Canary deploy.
    const m = rects[MONITOR];
    const c = rects[CANARY];
    let d;
    let arrow;
    let lx;
    let ly;
    if (isV) {
      const ay = c.y + nh / 2;
      const by = m.y + nh / 2;
      d = `M${m.x + nw} ${by} C${m.x + nw + 48} ${by} ${m.x + nw + 48} ${ay} ${c.x + nw + 2} ${ay}`;
      arrow = `${c.x + nw + 10},${ay - 5} ${c.x + nw + 10},${ay + 5} ${c.x + nw + 1},${ay}`;
      lx = W - 8;
      ly = (ay + by) / 2;
    } else {
      const ax = c.x + nw / 2;
      const bx = m.x + nw / 2;
      const y0 = m.y + nh;
      d = `M${bx} ${y0} C${bx} ${y0 + 50} ${ax} ${y0 + 50} ${ax} ${y0 + 2}`;
      arrow = `${ax - 5},${y0 + 10} ${ax + 5},${y0 + 10} ${ax},${y0 + 1}`;
      lx = (ax + bx) / 2;
      ly = y0 + 52;
    }
    const rbGroup = svg('g', { class: 'pl__rollback' }, diagram);
    const rbPath = svg('path', { d, fill: 'none', class: 'pl__rb-path' }, rbGroup);
    svg('polygon', { points: arrow, class: 'pl__rb-arrow' }, rbGroup);
    const rbLabel = svg('text', {
      x: lx, y: ly, 'text-anchor': 'middle', class: 'pl__rb-label',
      ...(isV ? { transform: `rotate(90 ${lx} ${ly})` } : {}),
    }, rbGroup);
    rollbackEls = { group: rbGroup, path: rbPath, label: rbLabel };

    // Nodes.
    nodes = STAGES.map((stage, i) => {
      const r = rects[i];
      const g = svg('g', { class: 'pl__node' }, diagram);
      svg('rect', { x: r.x, y: r.y, width: nw, height: nh, rx: 10 }, g);

      const iconX = isV ? r.x + nw - 18 : r.x + 16;
      const iconY = r.y + 18;
      const icon = svg('g', { class: 'pl__icon', transform: `translate(${iconX} ${iconY})` }, g);
      svg('circle', { r: 5, class: 'i-idle' }, icon);
      svg('circle', { r: 7, class: 'i-run', fill: 'none' }, icon);
      svg('path', { d: 'M-5 0.5 L-1.5 4 L5.5 -4', fill: 'none', class: 'i-ok' }, icon);
      svg('path', { d: 'M-4.5 -4.5 L4.5 4.5 M4.5 -4.5 L-4.5 4.5', fill: 'none', class: 'i-fail' }, icon);

      const cx = isV ? r.x + 16 : r.x + nw / 2;
      const titleY = isV ? r.y + 24 : r.y + (stage.sub ? 42 : 52);
      const title = svg('text', {
        x: cx, y: titleY, class: 'pl__title', 'text-anchor': isV ? 'start' : 'middle',
      }, g);
      const sub = stage.sub
        ? svg('text', {
            x: cx, y: isV ? r.y + 43 : r.y + 76, class: 'pl__sub', 'text-anchor': isV ? 'start' : 'middle',
          }, g)
        : null;
      return { g, title, sub, cx, titleY };
    });

    token = svg('circle', { r: 8, class: 'pl__token', cx: 0, cy: 0 }, diagram);

    relabel();
    applyModel();
    applyTranslations(diagramEl);
  }

  /* ---- Model -> DOM ---------------------------------------------------- */
  function applyModel() {
    nodes.forEach((node, i) => {
      node.g.setAttribute('class', `pl__node pl__node--${model.states[i]}`);
    });
    links.forEach((link, i) => link.fill.classList.toggle('is-done', model.links[i]));
    rollbackEls.group.setAttribute('class', `pl__rollback pl__rollback--${model.rollback}`);
    const c = centers[model.tokenAt] ?? centers[0];
    token.setAttribute('cx', c.x);
    token.setAttribute('cy', c.y);
    token.classList.toggle('is-on', model.tokenVisible);
    applyTraffic(model.traffic);
    applyRoles();
    alarmEl.classList.toggle('pl__chip--alarm', model.alarm);
    alarmEl.classList.toggle('pl__chip--ok', !model.alarm);
    alarmEl.dataset.i18n = model.alarm ? 'pipeline.alarm.fire' : 'pipeline.alarm.ok';
    msgEl.dataset.i18n = `pipeline.msg.${model.msg}`;
    applyTranslations(root);
  }

  const setState = (i, state) => {
    model.states[i] = state;
    nodes[i]?.g.setAttribute('class', `pl__node pl__node--${state}`);
  };

  const setLink = (i, done) => {
    model.links[i] = done;
    links[i]?.fill.classList.toggle('is-done', done);
  };

  function setMsg(key) {
    model.msg = key;
    msgEl.dataset.i18n = `pipeline.msg.${key}`;
    msgEl.textContent = t(msgEl.dataset.i18n);
  }

  function setAlarm(on) {
    model.alarm = on;
    alarmEl.classList.toggle('pl__chip--alarm', on);
    alarmEl.classList.toggle('pl__chip--ok', !on);
    alarmEl.dataset.i18n = on ? 'pipeline.alarm.fire' : 'pipeline.alarm.ok';
    alarmEl.textContent = t(alarmEl.dataset.i18n);
  }

  function setRollback(value) {
    model.rollback = value;
    rollbackEls.group.setAttribute('class', `pl__rollback pl__rollback--${value}`);
  }

  function applyTraffic(v2) {
    const shares = [100 - v2, v2];
    shares.forEach((v, i) => {
      ver[i].pct.textContent = `${Math.round(v)}%`;
      ver[i].fill.style.transform = `scaleX(${clamp(v, 0, 100) / 100})`;
      const f = clamp(v, 0, 100) / 100;
      lanes[i].style.strokeWidth = 1 + 3 * f;
      lanes[i].style.opacity = 0.2 + 0.8 * f;
      boxes[i].style.opacity = 0.35 + 0.65 * f;
    });
  }

  function applyRoles() {
    model.roles.forEach((role, i) => {
      ver[i].role.dataset.i18n = `pipeline.role.${role}`;
      ver[i].role.textContent = t(`pipeline.role.${role}`);
      ver[i].box.dataset.state = role;
    });
  }

  function setRoles(v1, v2) {
    model.roles = [v1, v2];
    applyRoles();
  }

  function setTraffic(v) {
    model.traffic = v;
    applyTraffic(v);
  }

  function tweenTraffic(to, duration, ease = easeInOutCubic) {
    const from = model.traffic;
    run.tween(duration, (p) => setTraffic(lerp(from, to, p)), { ease });
  }

  function moveToken(i, duration, done) {
    const from = centers[model.tokenAt] ?? centers[0];
    const to = centers[i];
    model.tokenAt = i;
    model.tokenVisible = true;
    token.classList.add('is-on');
    run.tween(duration, (p) => {
      token.setAttribute('cx', lerp(from.x, to.x, p));
      token.setAttribute('cy', lerp(from.y, to.y, p));
    }, { ease: easeInOutCubic });
    run.after(duration + 20, done);
  }

  /* ---- Traffic flow ---------------------------------------------------- */
  function buildFlow() {
    flowEl.replaceChildren();
    svg('circle', { cx: FLOW_FROM.x - 8, cy: FLOW_FROM.y, r: 6, class: 'pl__src' }, flowEl);
    lanes = LANES.map((lane) => {
      const d = `M${FLOW_FROM.x} ${FLOW_FROM.y} C130 ${FLOW_FROM.y} 130 ${lane.y} ${FLOW_TO_X} ${lane.y}`;
      return svg('path', { d, fill: 'none', class: `pl__lane pl__lane--${lane.cls}` }, flowEl);
    });
    boxes = LANES.map((lane, i) => {
      const g = svg('g', { class: `pl__endpoint pl__endpoint--${lane.cls}` }, flowEl);
      svg('rect', { x: FLOW_TO_X, y: lane.y - 14, width: 56, height: 28, rx: 7 }, g);
      const label = svg('text', { x: FLOW_TO_X + 28, y: lane.y + 4, 'text-anchor': 'middle' }, g);
      label.textContent = `v${i + 1}`;
      return g;
    });
    pool = Array.from({ length: POOL }, () => ({
      el: svg('circle', { r: 3, class: 'pl__dot', cx: 0, cy: 0 }, flowEl),
      lane: 0,
      p: 1,
    }));
    acc = [0, 0];
  }

  // Particles leave the source in proportion to each version's traffic share.
  function flowStep() {
    const shares = [100 - model.traffic, model.traffic].map((v) => v / 100);
    shares.forEach((share, i) => {
      acc[i] += 0.5 * share;
      while (acc[i] >= 1) {
        acc[i] -= 1;
        const free = pool.find((d) => d.p >= 1);
        if (!free) break;
        free.lane = i;
        free.p = 0;
        free.el.setAttribute('class', `pl__dot pl__dot--${LANES[i].cls}`);
      }
    });
    pool.forEach((d) => {
      if (d.p >= 1) {
        d.el.style.opacity = 0;
        return;
      }
      d.p = Math.min(1, d.p + 0.04);
      const pt = flowPoint(LANES[d.lane], d.p);
      d.el.setAttribute('cx', pt.x);
      d.el.setAttribute('cy', pt.y);
      d.el.style.opacity = d.p >= 1 ? 0 : 1;
    });
  }

  /* ---- Sparkline ------------------------------------------------------- */
  const yOfErr = (v) => 66 - (clamp(v, 0, 100) / 100) * 62;

  function drawSpark() {
    const step = 240 / (SAMPLES - 1);
    const pts = samples.map((v, i) => `${(i * step).toFixed(1)},${yOfErr(v).toFixed(1)}`);
    sparkLine.setAttribute('points', pts.join(' '));
    sparkArea.setAttribute('points', `0,70 ${pts.join(' ')} 240,70`);
  }

  function baseSamples() {
    samples = Array.from({ length: SAMPLES }, (_, i) => BASE_ERR + Math.sin(i * 0.9) * 2 + Math.cos(i * 2.3) * 1.5);
    errNow = BASE_ERR;
    errTarget = BASE_ERR;
    drawSpark();
  }

  function tick() {
    errNow = lerp(errNow, errTarget, 0.3);
    samples.push(errNow + (Math.random() - 0.5) * 5);
    samples.shift();
    drawSpark();
  }

  /* ---- Timelines ------------------------------------------------------- */
  function startRun() {
    phase = 'running';
    model.tokenAt = 0;
    run.every(160, tick);
    run.every(40, flowStep);
    advance(0);
  }

  function advance(i) {
    if (i >= STAGES.length) return finish();
    moveToken(i, i === 0 ? 0 : 450, () => {
      setState(i, 'running');
      setMsg(MESSAGES[i]);
      if (i === CANARY) {
        canary(() => complete(i));
      } else {
        run.after(i === MONITOR ? 900 : 550, () => complete(i));
      }
    });
  }

  function complete(i) {
    setState(i, 'ok');
    if (i < STAGES.length - 1) setLink(i, true);
    advance(i + 1);
  }

  // v2 arrives: v1 relabels to Previous, then traffic shifts gradually to v2.
  function canary(done) {
    setRoles('previous', 'new');
    tweenTraffic(10, 500);
    run.after(1500, () => {
      tweenTraffic(100, 1200);
      run.after(1300, () => {
        setRoles('previous', 'current');
        done();
      });
    });
  }

  function finish() {
    phase = 'live';
    model.tokenVisible = false;
    token.classList.remove('is-on');
    setMsg('healthy');
    if (pendingFailure) {
      pendingFailure = false;
      run.after(700, failSequence);
    }
  }

  function failSequence() {
    phase = 'failing';
    // Start from a healthy new version at 100% (as if a new release just shipped).
    setRollback('off');
    setAlarm(false);
    setState(CANARY, 'ok');
    setState(MONITOR, 'ok');
    setRoles('previous', 'current');
    setTraffic(100);

    setMsg('spike');
    errTarget = SPIKE_ERR;
    run.after(1400, () => {
      setAlarm(true);
      setState(MONITOR, 'fail');
      setMsg('alarm');
      run.after(600, () => {
        setRollback('active');
        setState(CANARY, 'fail');
        setRoles('previous', 'failed');
        tweenTraffic(0, 1400);
        run.after(2100, () => {
          errTarget = BASE_ERR;
          setMsg('rolledback');
          run.after(1500, () => {
            setAlarm(false);
            setState(CANARY, 'ok');
            setState(MONITOR, 'ok');
            setRollback('done');
            setRoles('current', 'failed');
            phase = 'live';
          });
        });
      });
    });
  }

  function inject() {
    if (phase === 'failing') return;
    if (phase === 'live') {
      failSequence();
      return;
    }
    // Pipeline still running (or not started): fail as soon as it is live.
    pendingFailure = true;
    failRequestedAt = performance.now();
    if (phase === 'idle') startRun();
  }

  function resetModel() {
    model.states = STAGES.map(() => 'idle');
    model.links = STAGES.map(() => false);
    model.rollback = 'off';
    model.tokenAt = 0;
    model.tokenVisible = false;
    model.traffic = 0;
    model.roles = ['current', 'none'];
    model.msg = 'idle';
    model.alarm = false;
  }

  return {
    mount(el) {
      root = el;
      el.innerHTML = TEMPLATE;
      diagramEl = el.querySelector('[data-role="diagram"]');
      msgEl = el.querySelector('[data-role="msg"]');
      alarmEl = el.querySelector('[data-role="alarm"]');
      failBtn = el.querySelector('[data-role="fail"]');
      flowEl = el.querySelector('[data-role="flow"]');
      ver = ['v1', 'v2'].map((v) => ({
        box: el.querySelector(`[data-role="ver-${v}"]`),
        role: el.querySelector(`[data-role="role-${v}"]`),
        pct: el.querySelector(`[data-role="pct-${v}"]`),
        fill: el.querySelector(`[data-role="fill-${v}"]`),
      }));
      sparkLine = el.querySelector('[data-role="spark-line"]');
      sparkArea = el.querySelector('[data-role="spark-area"]');
      const th = el.querySelector('[data-role="threshold"]');
      th.setAttribute('y1', yOfErr(ALARM_AT));
      th.setAttribute('y2', yOfErr(ALARM_AT));

      failBtn.addEventListener('click', inject);

      baseSamples();
      buildFlow();
      buildDiagram();

      mq = window.matchMedia('(min-width: 760px)');
      onMq = () => buildDiagram();
      mq.addEventListener('change', onMq);
      unsubLang = onLangChange(() => relabel());
    },

    play() {
      this.reset();
      // Keep a failure requested a moment ago (e.g. key r pressed before the
      // stage was on screen).
      if (performance.now() - failRequestedAt < 2000) pendingFailure = true;
      startRun();
    },

    reset() {
      run.cancel();
      if (!root) return;
      phase = 'idle';
      pendingFailure = false;
      resetModel();
      baseSamples();
      applyModel();
    },

    action(name) {
      if (name === 'inject-failure') inject();
    },

    destroy() {
      run.cancel();
      unsubLang();
      mq?.removeEventListener('change', onMq);
      root?.replaceChildren();
    },
  };
}
