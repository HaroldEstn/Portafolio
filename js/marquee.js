// Hero certifications marquee: a continuous strip of badge images driven by
// the shared badges.json list. The track is rendered twice (the copy is
// aria-hidden and not focusable) so a -50% translate loops seamlessly.

import { getBadges } from './certs.js';

function buildTrack(badges, { hidden }) {
  const track = document.createElement('ul');
  track.className = 'marquee__track';
  if (hidden) track.setAttribute('aria-hidden', 'true');

  badges.forEach((badge) => {
    const rawUrl = badge.badge_template?.image_url || '';
    if (!rawUrl.startsWith('https://')) return;
    const name = badge.badge_template?.name || 'Certification';

    const li = document.createElement('li');
    li.className = 'marquee__item';

    const a = document.createElement('a');
    a.href = `https://www.credly.com/badges/${badge.id}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = name;
    if (hidden) a.tabIndex = -1;

    const img = document.createElement('img');
    img.src = rawUrl;
    img.alt = hidden ? '' : name;
    img.width = 72;
    img.height = 72;
    img.decoding = 'async';
    img.draggable = false;

    a.appendChild(img);
    li.appendChild(a);
    track.appendChild(li);
  });
  return track;
}

export async function initMarquee() {
  const root = document.getElementById('cert-marquee');
  if (!root) return;
  try {
    const badges = await getBadges();
    const inner = document.createElement('div');
    inner.className = 'marquee__inner';
    inner.append(buildTrack(badges, { hidden: false }), buildTrack(badges, { hidden: true }));
    root.replaceChildren(inner);
    root.hidden = false;
  } catch (err) {
    root.hidden = true;
    console.error('Certifications marquee failed:', err);
  }
}
