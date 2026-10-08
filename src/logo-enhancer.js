function renderLogo() {
  const logo = document.querySelector('.brand .logo');
  if (!logo) return;

  logo.dataset.studentNetworkLogo = 'true';
  logo.setAttribute('aria-label', 'StudentNetwork logo');
  logo.title = 'StudentNetwork';
  logo.style.width = '48px';
  logo.style.height = '48px';
  logo.style.minWidth = '48px';
  logo.style.borderRadius = '14px';
  logo.style.padding = '0';
  logo.style.overflow = 'hidden';
  logo.style.display = 'grid';
  logo.style.placeItems = 'center';
  logo.style.background = 'linear-gradient(145deg,#11182f 0%,#25205f 55%,#635bff 100%)';
  logo.style.boxShadow = '0 9px 24px rgba(79,70,229,.24)';

  if (logo.querySelector('[data-sn-mark]')) return;

  logo.innerHTML = `
    <svg data-sn-mark viewBox="0 0 48 48" width="48" height="48" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="snGlow" x1="4" y1="4" x2="44" y2="44">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".98"/>
          <stop offset="1" stop-color="#bdb8ff" stop-opacity=".96"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx="14" fill="transparent"/>
      <path d="M13 17.5c0-2.2 1.8-4 4-4h14c2.2 0 4 1.8 4 4v13c0 2.2-1.8 4-4 4H21l-7 5v-22z" fill="none" stroke="url(#snGlow)" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M18 24.5h12M18 29h8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="18" cy="19" r="1.7" fill="#9c95ff"/>
    </svg>`;
}

function applyLogo() {
  renderLogo();
  if (document.body && !document.body.dataset.snLogoObserver) {
    document.body.dataset.snLogoObserver = 'true';
    new MutationObserver(renderLogo).observe(document.body, { childList: true, subtree: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyLogo, { once: true });
} else {
  applyLogo();
}

window.setTimeout(renderLogo, 100);
window.setTimeout(renderLogo, 500);
window.setTimeout(renderLogo, 1500);
