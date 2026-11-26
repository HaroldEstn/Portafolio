// Assemble contact links at runtime so the email and phone number never
// appear as plain text in the HTML source.

export function assembleContact() {
  const emailEl = document.getElementById('contactEmail');
  if (emailEl) {
    const { u, d, t } = emailEl.dataset;
    const email = `${u}@${d}.${t}`;
    emailEl.href = `mailto:${email}`;
    const label = emailEl.querySelector('.contact__value');
    if (label) label.textContent = email;
  }

  const waEl = document.getElementById('contactWa');
  if (waEl) {
    waEl.href = `https://wa.me/${waEl.dataset.cc}${waEl.dataset.n}`;
  }
}
