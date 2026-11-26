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

  // The current section follows the real scroll position: the last section
  // whose top is above 35% of the viewport; the last one at the page bottom.
  let ticking = false;
  function syncSection() {
    ticking = false;
    const doc = document.documentElement;
    const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
    let id = sections[0]?.id;
    if (atBottom) id = sections[sections.length - 1]?.id;
    else {
      const line = window.innerHeight * 0.35;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) id = s.id;
    }
    if (id && id !== currentSection) {
      currentSection = id;
      renderStatus();
    }
  }
  const queueSync = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(syncSection);
    }
  };
  window.addEventListener('scroll', queueSync, { passive: true });
  window.addEventListener('resize', queueSync);
  syncSection();

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
  // Small steps: smooth on the first press, instant on key repeat so a held key
  // scrolls continuously without queuing smooth animations. 'instant' (not
  // 'auto') because the stylesheet sets scroll-behavior: smooth on <html>.
  const lineStep = () => Math.max(60, Math.round(window.innerHeight * 0.15));
  const scrollByStep = (dy, repeat) =>
    window.scrollBy({ top: dy, behavior: repeat || prefersReducedMotion() ? 'instant' : 'smooth' });
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
    // AltGr reports altKey (and ctrlKey on some platforms) while still producing
    // a printable character such as { or }; let those through.
    const altGr = e.getModifierState?.('AltGraph');
    if (e.metaKey || e.defaultPrevented) return;
    if ((e.ctrlKey || e.altKey) && !altGr) return;
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
      case 'j': e.preventDefault(); scrollByStep(lineStep(), e.repeat); break;
      case 'k': e.preventDefault(); scrollByStep(-lineStep(), e.repeat); break;
      case 'd': e.preventDefault(); scrollByStep(window.innerHeight / 2, e.repeat); break;
      case 'u': e.preventDefault(); scrollByStep(-window.innerHeight / 2, e.repeat); break;
      case '}': stepSection(1); break;
      case '{': stepSection(-1); break;
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
