import { STUDENTNETWORK_LOGO } from './logo-data.js';

function applyLogo() {
  const logo = document.querySelector('.brand .logo');
  if (!logo || logo.dataset.studentNetworkLogo === 'true') return;

  logo.dataset.studentNetworkLogo = 'true';
  logo.innerHTML = '';
  logo.style.padding = '0';
  logo.style.overflow = 'hidden';
  logo.style.background = '#0d1226';

  const image = document.createElement('img');
  image.src = STUDENTNETWORK_LOGO;
  image.alt = 'StudentNetwork logo';
  image.width = 34;
  image.height = 34;
  image.style.width = '100%';
  image.style.height = '100%';
  image.style.objectFit = 'cover';
  image.style.display = 'block';
  logo.appendChild(image);
}

applyLogo();
new MutationObserver(applyLogo).observe(document.body, { childList: true, subtree: true });
