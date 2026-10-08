(() => {
  const MAX_FILES = 20;
  const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
  const MAX_FILE_BYTES = 10 * 1024 * 1024;
  const ACCEPT = '.pdf,.png,.jpg,.jpeg,.doc,.docx';

  const style = document.createElement('style');
  style.textContent = `
    .multi-file-list{display:grid;gap:8px;margin-top:10px;max-height:210px;overflow:auto}
    .multi-file-item{display:flex;align-items:center;gap:10px;padding:9px 11px;background:#f7f7fb;border:1px solid #e7e8f0;border-radius:10px;font-size:12px}
    .multi-file-item img{width:38px;height:38px;object-fit:cover;border-radius:8px;background:#ececff}
    .multi-file-item .multi-file-meta{min-width:0;flex:1}
    .multi-file-item b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .multi-file-item span{display:block;color:#858b9d;margin-top:2px}
    .multi-file-count{color:#635bff!important;font-weight:800}
  `;
  document.head.appendChild(style);

  const formatBytes = (bytes) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  const colorFor = (type) => ({ Notes: 'violet', Revision: 'amber', Worksheet: 'blue', Test: 'emerald', 'Question Bank': 'rose' }[type] || 'violet');

  function enhance() {
    const input = document.querySelector('.dropzone input[type="file"]');
    const form = input?.closest('form');
    if (!input || !form || input.dataset.multiEnhanced === '1') return;
    input.dataset.multiEnhanced = '1';
    input.setAttribute('multiple', 'multiple');
    input.setAttribute('accept', ACCEPT);

    const dropzone = input.closest('.dropzone');
    const originalText = dropzone?.querySelector('b');
    const originalHint = dropzone?.querySelector('span');
    const list = document.createElement('div');
    list.className = 'multi-file-list';
    dropzone?.appendChild(list);

    const updatePreview = () => {
      const files = Array.from(input.files || []);
      list.innerHTML = '';
      if (!files.length) {
        if (originalText) originalText.textContent = 'Choose your study material';
        if (originalHint) originalHint.textContent = 'Select multiple images, PDFs or documents at once · up to 20 files';
        return;
      }
      const total = files.reduce((sum, file) => sum + file.size, 0);
      if (originalText) originalText.textContent = `${files.length} file${files.length === 1 ? '' : 's'} selected`;
      if (originalHint) originalHint.innerHTML = `<span class="multi-file-count">${formatBytes(total)} total</span> · You can publish them together`;
      files.forEach((file) => {
        const row = document.createElement('div');
        row.className = 'multi-file-item';
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.alt = '';
          img.src = URL.createObjectURL(file);
          img.onload = () => URL.revokeObjectURL(img.src);
          row.appendChild(img);
        }
        const meta = document.createElement('div');
        meta.className = 'multi-file-meta';
        meta.innerHTML = `<b>${file.name.replace(/[&<>]/g, '')}</b><span>${file.type || 'File'} · ${formatBytes(file.size)}</span>`;
        row.appendChild(meta);
        list.appendChild(row);
      });
    };

    input.addEventListener('change', updatePreview);

    form.addEventListener('submit', (event) => {
      const files = Array.from(input.files || []);
      if (files.length <= 1) return;
      event.preventDefault();
      event.stopImmediatePropagation();

      const total = files.reduce((sum, file) => sum + file.size, 0);
      const titleInput = form.querySelector('input[type="text"]') || form.querySelector('input:not([type])');
      const selects = Array.from(form.querySelectorAll('select'));
      const user = (() => { try { return JSON.parse(localStorage.getItem('sn_user') || 'null'); } catch { return null; } })();
      if (!user || !titleInput?.value.trim()) return;

      if (files.length > MAX_FILES) {
        alert(`Please select at most ${MAX_FILES} files at once.`);
        return;
      }
      if (total > MAX_TOTAL_BYTES || files.some((file) => file.size > MAX_FILE_BYTES)) {
        alert(`Please keep each file under 10 MB and the complete selection under 25 MB.`);
        return;
      }

      const [subject, className, school, type] = selects.map((select) => select.value);
      const points = type === 'Notes' ? 35 : type === 'Revision' ? 45 : 25;
      const resource = {
        id: Date.now(),
        title: titleInput.value.trim(),
        subject: subject || 'Science',
        className: className || user.className || 'Class 7',
        school: school || user.school || '',
        type: type || 'Notes',
        author: user.name || 'Student',
        points,
        downloads: 0,
        created: 'just now',
        color: colorFor(type),
        fileName: files[0].name,
        fileNames: files.map((file) => file.name),
        fileCount: files.length
      };

      let resources = [];
      try { resources = JSON.parse(localStorage.getItem('sn_resources') || '[]'); } catch { resources = []; }
      localStorage.setItem('sn_resources', JSON.stringify([resource, ...resources]));
      const updatedUser = { ...user, points: (user.points || 0) + points };
      localStorage.setItem('sn_user', JSON.stringify(updatedUser));
      try {
        const users = JSON.parse(localStorage.getItem('sn_users') || '{}');
        if (updatedUser.id) users[updatedUser.id] = updatedUser;
        localStorage.setItem('sn_users', JSON.stringify(users));
      } catch {}
      alert(`${files.length} files published together! +${points} points.`);
      window.location.reload();
    }, true);
  }

  const observer = new MutationObserver(enhance);
  observer.observe(document.body, { childList: true, subtree: true });
  enhance();
})();
