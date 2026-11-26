// Vim-style keyboard navigation, statusline and help overlay.
//
// Loosely coupled to the stage through DOM events on `document`:
//   out: stage:select {id | delta}, stage:replay, stage:action {action}
//   in:  stage:change {id}

import { getLang, onLangChange, t, toggleLang } from './i18n.js';
import { prefersReducedMotion } from './util.js';

const SEQUENCE_MS = 500;

export function initKeys() {
  const sections = [...document.querySelectorAll('main > section[data-nav]')];
  const sceneIds = [...document.querySelectorAll('.stage__tab[data-scene]')].map((b) => b.dataset.scene);
  const help = document.getElementById('help');
  const modeEl = document.getElementById('sl-mode');
  const sectionEl = document.getElementById('sl-section');
  const sceneEl = document.getElementById('sl-scene');
  const langEl = document.getElementById('sl-lang');

  let currentSection = sections[0]?.id ?? 'hero';
  let currentScene = document.querySelector('.stage__tab[aria-selected="true"]')?.dataset.scene ?? sceneIds[0];
  let lastG = 0;
  let lastFocus = null;

  /* ---- Statusline ------------------------------------------------------ */
  function renderStatus() {
    modeEl.textContent = help && !help.hidden ? 'HELP' : 'NORMAL';
    sectionEl.textContent = t(`nav.${currentSection}`);
    sceneEl.textContent = t(`scene.${currentScene}`);
    langEl.textContent = getLang().toUpperCase();
  }

  if ('IntersectionObserver' in window) {
    // A section is "current" while it crosses a thin band near the top third.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          currentSection = entry.target.id;
          renderStatus();
        });
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }

  document.addEventListener('stage:change', (e) => {
    currentScene = e.detail.id;
    renderStatus();
  });
  onLangChange(renderStatus);

  /* ---- Actions --------------------------------------------------------- */
  const behavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

  function goToSection(index) {
    const target = sections[Math.max(0, Math.min(sections.length - 1, index))];
    if (target) target.scrollIntoView({ behavior: behavior(), block: 'start' });
  }

  const stepSection = (delta) => goToSection(sections.findIndex((s) => s.id === currentSection) + delta);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: behavior() });
  const scrollBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: behavior() });
  const emit = (name, detail = {}) => document.dispatchEvent(new CustomEvent(name, { detail }));

  function openHelp() {
    if (!help.hidden) return;
    lastFocus = document.activeElement;
    help.hidden = false;
    help.querySelector('.help__close').focus();
    renderStatus();
  }

  function closeHelp() {
    if (help.hidden) return;
    help.hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    renderStatus();
  }

  /* ---- Key handling ---------------------------------------------------- */
  const isTyping = (el) =>
    !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
  const isInteractive = (el) => !!el?.closest?.('button, a[href], [role="tab"], summary');

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
    if (isTyping(e.target)) return;

    if (e.key === 'Escape') {
      if (!help.hidden) {
        e.preventDefault();
        closeHelp();
      }
      return;
    }

    if (e.key === '?') {
      e.preventDefault();
      help.hidden ? openHelp() : closeHelp();
      return;
    }

    if (!help.hidden) return; // overlay open: only Esc and ? act

    // `gg` sequence: second g within the buffer window goes to the top.
    if (e.key === 'g') {
      const now = performance.now();
      if (now - lastG <= SEQUENCE_MS) {
        lastG = 0;
        scrollTop();
      } else {
        lastG = now;
      }
      return;
    }
    lastG = 0;

    switch (e.key) {
      case 'j': stepSection(1); break;
      case 'k': stepSection(-1); break;
      case 'G': scrollBottom(); break;
      case 'h': emit('stage:select', { delta: -1 }); break;
      case 'l': emit('stage:select', { delta: 1 }); break;
      case '1': case '2': case '3': case '4': case '5': {
        const id = sceneIds[Number(e.key) - 1];
        if (id) emit('stage:select', { id });
        break;
      }
      case ' ':
      case 'Enter':
        if (isInteractive(e.target)) return; // let buttons and links act normally
        e.preventDefault();
        emit('stage:replay');
        break;
      case 'r': emit('stage:action', { action: 'inject-failure' }); break;
      case 't': toggleLang(); break;
      default: return;
    }
  });

  /* ---- Help overlay wiring --------------------------------------------- */
  document.getElementById('sl-help')?.addEventListener('click', openHelp);
  help.querySelector('.help__close').addEventListener('click', closeHelp);
  help.addEventListener('click', (e) => {
    if (e.target === help) closeHelp();
  });

  renderStatus();
}
