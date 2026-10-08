(() => {
  const TYPES = ['All work', 'Notes', 'Worksheets', 'Question Banks', 'Tests', 'Revision', 'Assignments', 'Projects'];
  const esc = (value) => String(value || '').replace(/[&<>\"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;' }[c]));

  function styles() {
    if (document.getElementById('sn-work-library-styles')) return;
    const style = document.createElement('style');
    style.id = 'sn-work-library-styles';
    style.textContent = `
      .sn-work-focus{margin:0 auto 34px;max-width:1180px;padding:0 24px}
      .sn-work-focus-card{background:linear-gradient(135deg,#10162b 0%,#181d3a 65%,#25205f 100%);color:#fff;border-radius:24px;padding:28px;display:flex;align-items:center;justify-content:space-between;gap:24px;box-shadow:0 18px 50px rgba(16,22,43,.16)}
      .sn-work-focus-card .kicker{color:#bcb7ff}.sn-work-focus-card h2{margin:5px 0 7px;font-size:28px;letter-spacing:-.03em}.sn-work-focus-card p{margin:0;color:#cbd0df;line-height:1.55;max-width:650px}.sn-work-focus-actions{display:flex;gap:10px;flex-shrink:0}.sn-work-focus-actions button{border:0;border-radius:12px;padding:12px 16px;font-weight:800;cursor:pointer}.sn-work-open{background:#fff;color:#171a2c}.sn-work-add{background:#766cff;color:#fff}
      .sn-library-tools{margin:22px 0 26px;padding:18px;background:#fff;border:1px solid #e7e8f0;border-radius:18px;box-shadow:0 8px 28px rgba(25,32,61,.05)}
      .sn-library-tools-top{display:flex;gap:12px;align-items:center;justify-content:space-between}.sn-library-search{display:flex;align-items:center;gap:9px;flex:1;background:#f7f7fb;border:1px solid #e5e6ef;border-radius:12px;padding:10px 13px}.sn-library-search input{border:0;outline:0;background:transparent;width:100%;font:inherit}.sn-library-count{font-weight:800;white-space:nowrap}.sn-library-types{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.sn-library-type{border:1px solid #e2e3eb;background:#fff;border-radius:999px;padding:7px 11px;font-size:12px;cursor:pointer}.sn-library-type.active{background:#161b31;color:#fff;border-color:#161b31}.sn-library-reset{border:0;background:transparent;color:#635bff;font-weight:700;cursor:pointer;margin-left:auto}
      .sn-attachment-count{display:inline-flex;align-items:center;gap:5px;margin-top:9px;padding:5px 8px;border-radius:999px;background:#f0efff;color:#5148c9;font-size:11px;font-weight:800}
      .sn-upload-database-note{margin:0 0 16px;padding:13px 15px;border-radius:13px;background:#f5f4ff;border:1px solid #e4e1ff;color:#49456e;font-size:13px;line-height:1.5}.sn-upload-database-note b{color:#302b78}
      @media(max-width:760px){.sn-work-focus-card{display:block;padding:22px}.sn-work-focus-actions{margin-top:18px}.sn-library-tools-top{display:block}.sn-library-count{display:block;margin-top:10px}.sn-library-reset{margin-left:8px}}
    `;
    document.head.appendChild(style);
  }

  function clickByText(text) {
    const buttons = Array.from(document.querySelectorAll('button'));
    const found = buttons.find((button) => button.textContent.trim().toLowerCase().includes(text.toLowerCase()));
    if (found) found.click();
  }

  function addHomeFocus() {
    const main = document.querySelector('main');
    if (!main || document.getElementById('sn-work-focus')) return;
    const hero = main.querySelector('.hero');
    if (!hero) return;
    const section = document.createElement('section');
    section.id = 'sn-work-focus';
    section.className = 'sn-work-focus';
    section.innerHTML = `
      <div class="sn-work-focus-card">
        <div>
          <div class="kicker">THE MAIN DATABASE</div>
          <h2>Your school's work, in one place.</h2>
          <p>StudentNetwork is built around one simple idea: collect useful school work, organise it by school, class and subject, and make it easy for another student to find.</p>
        </div>
        <div class="sn-work-focus-actions"><button class="sn-work-open" type="button">Browse work</button><button class="sn-work-add" type="button">Add work</button></div>
      </div>`;
    hero.insertAdjacentElement('afterend', section);
    section.querySelector('.sn-work-open').onclick = () => clickByText('explore resources');
    section.querySelector('.sn-work-add').onclick = () => clickByText('share your work');
  }

  function addExploreTools() {
    const main = document.querySelector('main');
    if (!main || !main.querySelector('.resource-grid') || document.getElementById('sn-library-tools')) return;
    const search = main.querySelector('.searchbar');
    if (!search) return;
    const tools = document.createElement('div');
    tools.id = 'sn-library-tools';
    tools.className = 'sn-library-tools';
    tools.innerHTML = `
      <div class="sn-library-tools-top"><label class="sn-library-search"><span>⌕</span><input type="search" placeholder="Quick-filter this work database" aria-label="Quick filter work database"></label><span class="sn-library-count">Organised work library</span></div>
      <div class="sn-library-types">${TYPES.map((type, i) => `<button class="sn-library-type${i === 0 ? ' active' : ''}" data-work-type="${esc(type)}" type="button">${esc(type)}</button>`).join('')}<button class="sn-library-reset" type="button">Reset filters</button></div>`;
    search.insertAdjacentElement('afterend', tools);

    const cards = () => Array.from(main.querySelectorAll('.resource-card'));
    const filter = () => {
      const q = tools.querySelector('input').value.trim().toLowerCase();
      const active = tools.querySelector('.sn-library-type.active')?.dataset.workType || 'All work';
      let shown = 0;
      cards().forEach((card) => {
        const text = card.textContent.toLowerCase();
        const type = card.querySelector('.type')?.textContent.trim().toLowerCase() || '';
        const okQ = !q || text.includes(q);
        const okType = active === 'All work' || type === active.toLowerCase();
        card.style.display = okQ && okType ? '' : 'none';
        if (okQ && okType) shown++;
      });
      const count = tools.querySelector('.sn-library-count');
      if (count) count.textContent = `${shown} visible resources`;
    };
    tools.querySelector('input').addEventListener('input', filter);
    tools.querySelectorAll('.sn-library-type').forEach((button) => button.addEventListener('click', () => {
      tools.querySelectorAll('.sn-library-type').forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      filter();
    }));
    tools.querySelector('.sn-library-reset').onclick = () => {
      tools.querySelector('input').value = '';
      tools.querySelector('.sn-library-type.active')?.classList.remove('active');
      tools.querySelector('.sn-library-type')?.classList.add('active');
      document.querySelectorAll('.filters select').forEach((select) => { if (select.options.length) select.selectedIndex = 0; });
      filter();
    };
    window.setTimeout(filter, 50);
  }

  function improveUpload() {
    const input = document.querySelector('.dropzone input[type="file"]');
    const form = input?.closest('form');
    if (!input || !form || form.dataset.snUploadFocus === '1') return;
    form.dataset.snUploadFocus = '1';
    input.multiple = true;
    input.accept = '.pdf,.png,.jpg,.jpeg,.webp,.doc,.docx';
    const dropzone = input.closest('.dropzone');
    if (dropzone && !dropzone.querySelector('.sn-upload-database-note')) {
      const note = document.createElement('div');
      note.className = 'sn-upload-database-note';
      note.innerHTML = '<b>Add to the work database.</b> Upload all pages/photos of the same resource together. Keep the title specific so other students can find it later.';
      dropzone.insertAdjacentElement('beforebegin', note);
    }
  }

  function addAttachmentBadges() {
    document.querySelectorAll('.resource-card').forEach((card) => {
      if (card.querySelector('.sn-attachment-count')) return;
      const text = card.textContent;
      const match = text.match(/(\d+) files?/i);
      if (!match) return;
      const badge = document.createElement('span');
      badge.className = 'sn-attachment-count';
      badge.textContent = `▧ ${match[1]} attachments`;
      card.querySelector('h3')?.insertAdjacentElement('afterend', badge);
    });
  }

  function run() {
    styles();
    addHomeFocus();
    addExploreTools();
    improveUpload();
    addAttachmentBadges();
  }

  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
