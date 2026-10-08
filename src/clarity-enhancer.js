(() => {
  const STYLE_ID = 'sn-clarity-styles';
  const HERO_TITLE = 'Find the work you need.<br /><span>Share what you have.</span>';
  const HERO_COPY = 'StudentNetwork is a shared school-work library. Find notes, worksheets, tests and assignments by school, class and subject — or add useful work for others.';

  function styles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .sn-how-simple{max-width:1180px;margin:0 auto 34px;padding:0 24px}
      .sn-how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .sn-how-card{border:1px solid #e7e8f0;background:#fff;border-radius:16px;padding:18px;box-shadow:0 7px 22px rgba(25,32,61,.04)}
      .sn-how-number{display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;border-radius:50%;background:#eeecff;color:#5148c9;font-weight:900;font-size:12px}
      .sn-how-card h3{font-size:16px;margin:11px 0 5px}
      .sn-how-card p{font-size:12px;color:#697087;line-height:1.55;margin:0}
      .sn-page-guide{margin:0 0 18px;padding:15px 17px;border:1px solid #e5e3ff;background:#f8f7ff;border-radius:15px;color:#45415f;font-size:13px;line-height:1.55}
      .sn-page-guide b{color:#302b78}
      @media(max-width:700px){.sn-how-grid{grid-template-columns:1fr}.sn-how-simple{padding:0 16px}}
    `;
    document.head.appendChild(s);
  }

  function simplifyNav() {
    const map = { Explore: 'Find Work', 'My Library': 'My Work', 'AI Studio': 'Study Tools', Rewards: 'Points' };
    document.querySelectorAll('.navlinks button').forEach((button) => {
      const key = button.textContent.trim();
      if (map[key]) button.textContent = map[key];
    });
  }

  function simplifyHome() {
    const main = document.querySelector('main');
    const hero = main?.querySelector('.hero');
    if (!hero) return;

    const h1 = hero.querySelector('h1');
    if (h1 && h1.innerHTML !== HERO_TITLE) h1.innerHTML = HERO_TITLE;
    const p = hero.querySelector('p');
    if (p && p.textContent !== HERO_COPY) p.textContent = HERO_COPY;

    if (document.getElementById('sn-how-simple')) return;
    const focus = document.getElementById('sn-work-focus');
    const section = document.createElement('section');
    section.id = 'sn-how-simple';
    section.className = 'sn-how-simple';
    section.innerHTML = '<div class="section-head"><div><div class="kicker">HOW IT WORKS</div><h2>Three simple steps</h2></div></div><div class="sn-how-grid"><div class="sn-how-card"><span class="sn-how-number">1</span><h3>Choose where you study</h3><p>Pick your school, class and subject so the database shows relevant work first.</p></div><div class="sn-how-card"><span class="sn-how-number">2</span><h3>Find or open the work</h3><p>Search by chapter, topic or resource type. Open a resource when you find the right one.</p></div><div class="sn-how-card"><span class="sn-how-number">3</span><h3>Help the next student</h3><p>Upload useful school work, keeping all pages of one resource together.</p></div></div>';
    if (focus) focus.insertAdjacentElement('afterend', section);
    else hero.insertAdjacentElement('afterend', section);
  }

  function guideExplore() {
    const main = document.querySelector('main');
    if (!main || !main.querySelector('.resource-grid') || main.querySelector('.sn-page-guide')) return;
    const top = main.querySelector('.page-top');
    if (!top) return;
    const guide = document.createElement('div');
    guide.className = 'sn-page-guide';
    guide.innerHTML = '<b>Start here:</b> choose a school, class and subject below. Then search for a chapter or topic. You can change the filters any time.';
    top.insertAdjacentElement('afterend', guide);
  }

  function guideUpload() {
    const main = document.querySelector('main');
    if (!main || !main.querySelector('.dropzone') || main.querySelector('.sn-page-guide')) return;
    const drop = main.querySelector('.dropzone');
    const guide = document.createElement('div');
    guide.className = 'sn-page-guide';
    guide.innerHTML = '<b>You are adding to the shared work library.</b> Upload every page/photo of the same resource together, give it a clear title, and select the correct school, class and subject.';
    drop.insertAdjacentElement('beforebegin', guide);
  }

  function run() {
    styles();
    simplifyNav();
    simplifyHome();
    guideExplore();
    guideUpload();
  }

  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
