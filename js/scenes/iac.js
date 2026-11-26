// IaC scene: "From code to cloud". A short CDK snippet types out, a nested
// stack tree lights up in dependency order, then the same tree is stamped into
// three identical environments. No numbers are rendered anywhere in the scene.

import { applyTranslations, t } from '../i18n.js';
import { createRunner, clamp } from '../util.js';

const CODE = [
  "const vpc = new Vpc(this, 'Net');",
  "new DatabaseInstance(this, 'Db');",
  "new ApplicationLoadBalancer(this, 'Lb');",
  "new FargateService(this, 'Api');",
  "new Alarm(this, 'Errors');",
];

// Dependency order: each stack lights only after the previous one is done.
const STACKS = [
  { key: 'network', resources: ['vpc', 'subnets'] },
  { key: 'data', resources: ['rds', 'dynamo', 'buckets'] },
  { key: 'compute', resources: ['ecs', 'lambda', 'lb'] },
  { key: 'monitoring', resources: ['alarms'] },
];
const ENVS = ['dev', 'staging', 'prod'];

// Timeline (ms).
const TYPE_MS = 2200;
const SYNTH_AT = 2400;
const STACK_AT = 2900;
const STACK_STEP = 1000;
const CHIP_STEP = 170;
const ENV_AT = STACK_AT + STACKS.length * STACK_STEP + 400;
const ENV_STEP = 450;
const CAPTION_AT = ENV_AT + ENVS.length * ENV_STEP + 300;
const FOCUS_AT = CAPTION_AT + 700;
const FOCUS_STEP = 700;

const TEMPLATE = `
  <div class="iac">
    <header class="scene__head">
      <h3 data-i18n="iac.title">From code to cloud</h3>
      <p data-i18n="iac.sub">A few lines of CDK become a nested stack tree, deployed in dependency order and repeated across environments.</p>
    </header>
    <div class="iac__main">
      <div class="iac__code" role="img" data-i18n-aria="iac.codeAlt" aria-label="AWS CDK code that defines a network, a database, a load balancer, a container service and an alarm.">
        <span class="iac__file" aria-hidden="true">app-stack.ts</span>
        <div class="iac__lines" aria-hidden="true">${CODE.map(
          (line) => `<div class="iac__line"><span class="iac__ghost">${line}</span><span class="iac__typed" data-role="typed"></span></div>`,
        ).join('')}</div>
      </div>
      <div class="iac__tree" data-role="tree">
        <div class="iac__root" data-role="root" data-i18n="iac.root">Parent stack</div>
        ${STACKS.map(
          (s) => `
        <div class="iac__link" data-role="link"></div>
        <div class="iac__stack" data-role="stack">
          <div class="iac__stack-name" data-i18n="iac.stack.${s.key}"></div>
          <ul class="iac__chips">${s.resources
            .map((r) => `<li class="iac__chip" data-role="chip" data-i18n="iac.res.${r}"></li>`)
            .join('')}</ul>
        </div>`,
        ).join('')}
      </div>
    </div>
    <p class="iac__msg" data-role="msg" data-i18n="iac.msg.code" aria-live="polite"></p>
    <div class="iac__envs" data-role="envs">
      ${ENVS.map(
        (name) => `
      <button type="button" class="iac__env" data-role="env" aria-pressed="false" inert>
        <span class="iac__env-name">${name}</span>
        <span class="iac__env-stacks">${STACKS.map(
          (s) => `<span class="iac__env-stack" data-i18n="iac.stack.${s.key}"></span>`,
        ).join('')}</span>
      </button>`,
      ).join('')}
    </div>
    <p class="iac__note" data-i18n="iac.note">Simplified view: the real stacks are larger, the shape is the same.</p>
  </div>`;

// Light syntax colouring for the (static, trusted) snippet.
const colourize = (text) =>
  text
    .replace(/'[^']*'?/g, (m) => `<span class="iac__str">${m}</span>`)
    .replace(/\b(const|new)\b/g, '<span class="iac__kw">$1</span>')
    .replace(/\b([A-Z][A-Za-z]+)(?=\()/g, '<span class="iac__cls">$1</span>');

export default function createIac() {
  const run = createRunner();
  let root;
  let q;
  let userPicked = false;

  const all = (role) => [...root.querySelectorAll(`[data-role="${role}"]`)];

  function setMsg(key) {
    q.msg.dataset.i18n = key;
    q.msg.textContent = t(key);
  }

  function setTyped(p) {
    const total = CODE.reduce((n, l) => n + l.length, 0);
    let left = Math.round(total * clamp(p, 0, 1));
    q.typed.forEach((el, i) => {
      const n = Math.min(CODE[i].length, left);
      left -= n;
      el.innerHTML = colourize(CODE[i].slice(0, n));
      el.classList.toggle('is-caret', n > 0 && n < CODE[i].length);
    });
  }

  // Automatic highlight pass: purely visual, never touches aria-pressed.
  function highlightEnv(index) {
    q.envs.forEach((card, i) => card.classList.toggle('is-focus', i === index));
  }

  // Real user selection: reserved for aria-pressed. Clicking again clears it.
  function selectEnv(index) {
    q.envs.forEach((card, i) => {
      const on = i === index;
      card.classList.toggle('is-selected', on);
      card.setAttribute('aria-pressed', String(on));
    });
  }

  function revealEnv(i) {
    q.envs[i].classList.add('is-on');
    q.envs[i].inert = false;
  }

  function clearState() {
    root.querySelectorAll('.is-on, .is-active, .is-done, .is-lit, .is-drawn, .is-focus, .is-selected').forEach((el) => {
      el.classList.remove('is-on', 'is-active', 'is-done', 'is-lit', 'is-drawn', 'is-focus');
    });
    q.envs.forEach((card) => card.setAttribute('aria-pressed', 'false'));
    q.tree.classList.remove('is-live');
    q.msg.classList.remove('is-final');
    setTyped(0);
    setMsg('iac.msg.code');
  }

  function lightStack(i) {
    const stack = q.stacks[i];
    q.links[i].classList.add('is-drawn');
    stack.classList.add('is-on', 'is-active');
    const chips = [...stack.querySelectorAll('[data-role="chip"]')];
    chips.forEach((chip, c) => run.after(300 + c * CHIP_STEP, () => chip.classList.add('is-lit')));
    run.after(300 + chips.length * CHIP_STEP + 150, () => {
      stack.classList.remove('is-active');
      stack.classList.add('is-done');
    });
  }

  return {
    mount(el) {
      root = el;
      el.innerHTML = TEMPLATE;
      applyTranslations(el);
      q = {
        typed: all('typed'),
        tree: root.querySelector('[data-role="tree"]'),
        root: root.querySelector('[data-role="root"]'),
        links: all('link'),
        stacks: all('stack'),
        envs: all('env'),
        msg: root.querySelector('[data-role="msg"]'),
      };
      q.envs.forEach((card, i) => {
        card.addEventListener('click', () => {
          if (card.inert) return;
          const already = card.classList.contains('is-selected');
          userPicked = !already;
          highlightEnv(-1);
          selectEnv(already ? -1 : i);
        });
      });
      clearState();
    },

    play() {
      this.reset();
      run.tween(TYPE_MS, setTyped);
      run.after(SYNTH_AT, () => {
        q.root.classList.add('is-on');
        q.tree.classList.add('is-live');
        setMsg('iac.msg.deploy');
      });
      STACKS.forEach((_, i) => run.after(STACK_AT + i * STACK_STEP, () => lightStack(i)));
      ENVS.forEach((_, i) => run.after(ENV_AT + i * ENV_STEP, () => revealEnv(i)));
      run.after(ENV_AT, () => setMsg('iac.msg.envs'));
      run.after(CAPTION_AT, () => q.msg.classList.add('is-final'));
      // One subtle highlight pass over the environments, unless the user picked one.
      ENVS.forEach((_, i) => run.after(FOCUS_AT + i * FOCUS_STEP, () => !userPicked && highlightEnv(i)));
      run.after(FOCUS_AT + ENVS.length * FOCUS_STEP, () => !userPicked && highlightEnv(-1));
    },

    reset() {
      run.cancel();
      userPicked = false;
      if (root) clearState();
    },

    destroy() {
      run.cancel();
      root?.replaceChildren();
    },
  };
}
