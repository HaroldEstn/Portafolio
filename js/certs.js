// Certifications: loads the Credly export from badges.json and renders
// grouped badge cards.

import { t } from './i18n.js';

const ISSUER_ORDER = ['aws', 'gitlab', 'google', 'other'];

const GROUP_LABELS = {
  aws: 'Amazon Web Services',
  gitlab: 'GitLab',
  google: 'Google Cloud',
  other: 'Other',
};

function issuerKey(badge) {
  const issuer = (badge.issuer?.entities?.[0]?.entity?.name || '').toLowerCase();
  const name = (badge.badge_template?.name || '').toLowerCase();
  const combined = `${issuer} ${name}`;
  if (combined.includes('aws') || combined.includes('amazon')) return 'aws';
  if (combined.includes('gitlab')) return 'gitlab';
  if (combined.includes('google')) return 'google';
  return 'other';
}

function groupBadges(badges) {
  const groups = {};
  badges.forEach((badge) => {
    const key = issuerKey(badge);
    (groups[key] ||= []).push(badge);
  });
  return groups;
}

function renderBadges(badges) {
  const container = document.getElementById('cert-grid');
  const groups = groupBadges(badges);

  ISSUER_ORDER.forEach((key) => {
    if (!groups[key]?.length) return;

    const section = document.createElement('div');
    section.className = `cert-group cert-group--${key}`;

    const heading = document.createElement('h3');
    heading.className = 'cert-group__title';
    heading.textContent = GROUP_LABELS[key];
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'cert-grid';

    groups[key].forEach((badge) => {
      const name = badge.badge_template?.name || 'Certification';
      const rawUrl = badge.badge_template?.image_url || '';
      const imageUrl = rawUrl.startsWith('https://') ? rawUrl : '';

      const a = document.createElement('a');
      a.href = `https://www.credly.com/badges/${badge.id}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = `cert-card cert-card--${key}`;

      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = '';
      img.width = 96;
      img.height = 96;
      img.loading = 'lazy';

      const span = document.createElement('span');
      span.textContent = name;

      a.append(img, span);
      grid.appendChild(a);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

let badgesPromise = null;

/** Fetch badges.json once and share the parsed list between consumers. */
export function getBadges() {
  badgesPromise ||= fetch('badges.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const badges = data.data || data;
      if (!Array.isArray(badges)) throw new Error('Unexpected format');
      return badges;
    });
  return badgesPromise;
}

export async function loadCertifications() {
  const statusEl = document.getElementById('cert-status');
  try {
    const badges = await getBadges();
    statusEl.hidden = true;
    renderBadges(badges);
  } catch (err) {
    statusEl.replaceChildren();
    const p = document.createElement('p');
    p.className = 'cert-error';
    p.dataset.i18n = 'certs.error';
    p.textContent = t('certs.error');
    statusEl.appendChild(p);
    console.error('Certifications load failed:', err);
  }
}
