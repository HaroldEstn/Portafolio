const ISSUER_ORDER = ['aws', 'gitlab', 'google', 'other'];

const GROUP_LABELS = {
  aws:    'Amazon Web Services',
  gitlab: 'GitLab',
  google: 'Google Cloud',
  other:  'Other',
};

function issuerKey(badge) {
  const issuer = (badge.issuer?.entities?.[0]?.entity?.name || '').toLowerCase();
  const name   = (badge.badge_template?.name || '').toLowerCase();
  const combined = issuer + ' ' + name;
  if (combined.includes('aws') || combined.includes('amazon')) return 'aws';
  if (combined.includes('gitlab'))                              return 'gitlab';
  if (combined.includes('google'))                             return 'google';
  return 'other';
}

function groupBadges(badges) {
  const groups = {};
  badges.forEach(badge => {
    const key = issuerKey(badge);
    if (!groups[key]) groups[key] = [];
    groups[key].push(badge);
  });
  return groups;
}

function renderBadges(badges) {
  const container = document.getElementById('cert-grid');
  const groups    = groupBadges(badges);

  ISSUER_ORDER.forEach(key => {
    if (!groups[key] || groups[key].length === 0) return;

    const section = document.createElement('div');
    section.className = `cert-group cert-group--${key}`;

    const heading = document.createElement('h3');
    heading.className = 'cert-group__title';
    heading.textContent = GROUP_LABELS[key];
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'cert-grid';

    groups[key].forEach(badge => {
      const name     = badge.badge_template?.name || 'Certification';
      const rawUrl   = badge.badge_template?.image_url || '';
      const imageUrl = rawUrl.startsWith('https://') ? rawUrl : '';
      const id       = badge.id;

      const a = document.createElement('a');
      a.href      = `https://www.credly.com/badges/${id}`;
      a.target    = '_blank';
      a.rel       = 'noopener noreferrer';
      a.className = `cert-card cert-card--${key}`;

      const img = document.createElement('img');
      img.src     = imageUrl;
      img.alt     = name;
      img.loading = 'lazy';

      const span = document.createElement('span');
      span.textContent = name;

      a.appendChild(img);
      a.appendChild(span);
      grid.appendChild(a);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

async function loadCertifications() {
  const statusEl = document.getElementById('cert-status');
  try {
    const res    = await fetch('badges.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data   = await res.json();
    const badges = data.data || data;
    if (!Array.isArray(badges)) throw new Error('Formato inesperado');
    statusEl.style.display = 'none';
    renderBadges(badges);
  } catch (err) {
    statusEl.innerHTML = '<p class="cert-error">Could not load certifications.</p>';
    console.error('Certifications load failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadCertifications);

// Assemble contact links via JS — keeps phone/email out of HTML source
document.addEventListener('DOMContentLoaded', () => {
  const emailEl = document.getElementById('contactEmail');
  if (emailEl) {
    const email = emailEl.dataset.u + '@' + emailEl.dataset.d + '.' + emailEl.dataset.t;
    emailEl.href = 'mailto:' + email;
    emailEl.querySelector('span').textContent = email;
  }

  const waEl = document.getElementById('contactWa');
  if (waEl) {
    waEl.href = 'https://wa.me/' + waEl.dataset.cc + waEl.dataset.n;
  }
});
