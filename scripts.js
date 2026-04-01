const CREDLY_API =
  'https://api.allorigins.win/get?url=' +
  encodeURIComponent('https://www.credly.com/users/harold-gamboa.d3e81b3a/badges.json');

const ISSUER_ORDER = ['aws', 'gitlab', 'google'];

function issuerKey(badge) {
  const issuer = (badge.issuer?.entities?.[0]?.entity?.name || '').toLowerCase();
  const name   = (badge.badge_template?.name || '').toLowerCase();
  const combined = issuer + ' ' + name;
  if (combined.includes('aws') || combined.includes('amazon')) return 'aws';
  if (combined.includes('gitlab'))                               return 'gitlab';
  if (combined.includes('google'))                              return 'google';
  return 'other';
}

function sortBadges(badges) {
  return [...badges].sort((a, b) => {
    const ai = ISSUER_ORDER.indexOf(issuerKey(a));
    const bi = ISSUER_ORDER.indexOf(issuerKey(b));
    const av = ai === -1 ? ISSUER_ORDER.length : ai;
    const bv = bi === -1 ? ISSUER_ORDER.length : bi;
    return av - bv;
  });
}

function renderBadges(badges) {
  const grid = document.getElementById('cert-grid');
  const sorted = sortBadges(badges);

  sorted.forEach(badge => {
    const name     = badge.badge_template?.name || 'Certification';
    const imageUrl = badge.badge_template?.image_url || '';
    const id       = badge.id;
    const link     = `https://www.credly.com/badges/${id}`;
    const key      = issuerKey(badge);

    const a = document.createElement('a');
    a.href   = link;
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
    a.className = `cert-card cert-card--${key}`;

    const img = document.createElement('img');
    img.src   = imageUrl;
    img.alt   = name;
    img.loading = 'lazy';

    const span = document.createElement('span');
    span.textContent = name;

    a.appendChild(img);
    a.appendChild(span);
    grid.appendChild(a);
  });
}

async function loadCertifications() {
  const statusEl = document.getElementById('cert-status');

  try {
    const res  = await fetch(CREDLY_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data   = await res.json();
    const parsed = JSON.parse(data.contents);
    const badges = parsed.data || parsed;

    statusEl.style.display = 'none';
    renderBadges(badges);
  } catch (err) {
    statusEl.innerHTML =
      '<p class="cert-error">Could not load certifications. Please try again later.</p>';
    console.error('Certifications fetch failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadCertifications);
