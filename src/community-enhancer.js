const KEY = 'sn_help_requests';
const DEFAULT_REQUESTS = [
  { id: 1, title: 'Need a Class 7 Science revision sheet', subject: 'Science', reward: 60, asker: 'Riya', status: 'open' },
  { id: 2, title: 'Looking for difficult Integers questions', subject: 'Mathematics', reward: 45, asker: 'Aman', status: 'open' },
];

const getUser = () => { try { return JSON.parse(localStorage.getItem('sn_user') || 'null'); } catch { return null; } };
const getRequests = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT_REQUESTS; } catch { return DEFAULT_REQUESTS; } };
const saveRequests = (items) => localStorage.setItem(KEY, JSON.stringify(items));
const getPoints = () => { const user = getUser(); return Number(user?.points || 0); };
const award = (amount) => {
  const user = getUser();
  if (!user) return;
  user.points = getPoints() + amount;
  localStorage.setItem('sn_user', JSON.stringify(user));
  try { const users = JSON.parse(localStorage.getItem('sn_users') || '{}'); if (users[user.id]) { users[user.id] = user; localStorage.setItem('sn_users', JSON.stringify(users)); } } catch {}
};

const style = document.createElement('style');
style.textContent = `
.sn-enhance-btn{border:0;background:linear-gradient(135deg,#6d5dfc,#8b5cf6);color:#fff!important;padding:9px 13px;border-radius:11px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(109,93,252,.2);font-size:13px}
.sn-enhance-float{position:fixed;right:20px;bottom:20px;z-index:9000;border:0;border-radius:999px;padding:13px 17px;background:#111827;color:white;font-weight:800;box-shadow:0 14px 35px rgba(0,0,0,.22);cursor:pointer}
.sn-enhance-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(8,12,25,.62);backdrop-filter:blur(8px);display:grid;place-items:center;padding:20px}
.sn-enhance-modal{width:min(900px,100%);max-height:min(760px,92vh);overflow:auto;background:#fff;border-radius:26px;box-shadow:0 30px 100px rgba(0,0,0,.3);font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;color:#111827}
.sn-enhance-head{padding:25px 27px 18px;border-bottom:1px solid #e9eaf0;display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.sn-enhance-head h2{margin:5px 0;font-size:28px}.sn-enhance-head p{margin:0;color:#687083}.sn-close{border:0;background:#f2f3f7;border-radius:12px;width:38px;height:38px;font-size:22px;cursor:pointer}
.sn-enhance-body{padding:22px 27px;display:grid;grid-template-columns:1.05fr .95fr;gap:18px}.sn-panel{border:1px solid #e8e9ef;border-radius:19px;padding:20px;background:#fbfbfd}.sn-panel.primary{background:linear-gradient(145deg,#f7f5ff,#fff)}.sn-label{display:inline-block;font-size:10px;font-weight:900;letter-spacing:.12em;color:#6d5dfc}.sn-panel h3{margin:9px 0 7px;font-size:21px}.sn-panel p{color:#667085;line-height:1.55;font-size:14px}.sn-mission{display:flex;gap:10px;padding:12px 0;border-top:1px solid #ececf1}.sn-mission b{font-size:13px}.sn-mission small{display:block;color:#8a90a0;margin-top:3px}.sn-complete{width:100%;border:0;border-radius:12px;padding:12px;background:#111827;color:#fff;font-weight:800;cursor:pointer}.sn-complete.done{background:#e9f8ef;color:#16733e}.sn-request{display:flex;gap:7px;margin:14px 0}.sn-request input{flex:1;min-width:0;border:1px solid #dfe2e9;border-radius:11px;padding:11px 12px;outline:none}.sn-request button{border:0;border-radius:11px;background:#111827;color:white;padding:0 14px;font-weight:800;cursor:pointer}.sn-help{display:grid;gap:8px}.sn-help-row{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px;border:1px solid #e9eaf0;border-radius:12px;background:#fff}.sn-help-row b{display:block;font-size:12px}.sn-help-row small{display:block;color:#8a90a0;margin-top:3px}.sn-help-row button{border:0;border-radius:9px;background:#6d5dfc;color:#fff;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer}.sn-flow{padding:18px 27px 25px;border-top:1px solid #e9eaf0;display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap}.sn-flow span{background:#f2f3f7;padding:9px 12px;border-radius:10px;font-size:11px;font-weight:900}.sn-flow i{color:#9aa1b1;font-style:normal}@media(max-width:700px){.sn-enhance-body{grid-template-columns:1fr}.sn-enhance-float{right:14px;bottom:14px}}
`;
document.head.appendChild(style);

function openMissions() {
  if (document.querySelector('.sn-enhance-backdrop')) return;
  const user = getUser();
  const backdrop = document.createElement('div');
  backdrop.className = 'sn-enhance-backdrop';
  const modal = document.createElement('section');
  modal.className = 'sn-enhance-modal';
  const render = () => {
    const requests = getRequests();
    const done = localStorage.getItem('sn_mission_v1_done') === '1';
    modal.innerHTML = `
      <div class="sn-enhance-head"><div><span class="sn-label">NEW · COMMUNITY LEARNING LOOP</span><h2>Student Missions</h2><p>Turn studying into a network where helping other students is part of learning.</p></div><button class="sn-close" aria-label="Close">×</button></div>
      <div class="sn-enhance-body">
        <div class="sn-panel primary"><span class="sn-label">DAILY MISSION</span><h3>Teach one thing you know</h3><p>Pick something you studied today and explain its hardest idea in 3–5 sentences. The goal is understanding, not copying.</p>
          <div class="sn-mission"><strong>1</strong><div><b>Choose a topic</b><small>Any subject, chapter or concept.</small></div></div>
          <div class="sn-mission"><strong>2</strong><div><b>Explain it simply</b><small>Write it like you are helping a friend.</small></div></div>
          <button class="sn-complete ${done ? 'done' : ''}" data-complete>${done ? '✓ Mission completed · 75 points' : 'Complete mission · +75 points'}</button>
        </div>
        <div class="sn-panel"><span class="sn-label">PEER HELP EXCHANGE</span><h3>Ask for exactly what you need</h3><p>A student can request a specific resource. Another student claims it, creates it and earns a contribution bonus.</p>
          <form class="sn-request"><input name="request" placeholder="e.g. Photosynthesis one-page notes" required><button>Ask</button></form>
          <div class="sn-help">${requests.slice(0,4).map((r) => `<div class="sn-help-row"><div><b>${escapeHtml(r.title)}</b><small>${escapeHtml(r.asker)} · ${r.reward} pts · ${r.status}</small></div>${r.status === 'open' && r.asker !== user?.name ? `<button data-help="${r.id}">Help</button>` : '<small>Claimed</small>'}</div>`).join('')}</div>
        </div>
      </div>
      <div class="sn-flow"><span>ASK</span><i>→</i><span>HELP</span><i>→</i><span>VERIFY</span><i>→</i><span>EARN</span></div>`;
    modal.querySelector('.sn-close').onclick = () => backdrop.remove();
    modal.querySelector('[data-complete]').onclick = () => { if (!done && user) { award(75); localStorage.setItem('sn_mission_v1_done','1'); render(); } else if (!user) alert('Please sign in first.'); };
    modal.querySelector('.sn-request').onsubmit = (e) => { e.preventDefault(); if (!user) return alert('Please sign in first.'); const value = new FormData(e.currentTarget).get('request').toString().trim(); if (!value) return; saveRequests([{ id: Date.now(), title:value, subject:user.className || 'General', reward:50, asker:user.name, status:'open' }, ...requests]); render(); };
    modal.querySelectorAll('[data-help]').forEach((button) => button.onclick = () => { const id = Number(button.dataset.help); saveRequests(getRequests().map((r) => r.id === id ? {...r,status:'claimed',helper:user?.name} : r)); if (user) award(15); render(); });
  };
  backdrop.appendChild(modal); document.body.appendChild(backdrop); render();
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
}
function escapeHtml(value) { return String(value).replace(/[&<>\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c])); }

function install() {
  if (!document.querySelector('[data-sn-missions]')) {
    const nav = document.querySelector('.navlinks');
    if (nav) { const b = document.createElement('button'); b.textContent='Missions'; b.dataset.snMissions='1'; b.className='sn-enhance-btn'; b.onclick=openMissions; nav.appendChild(b); }
  }
  if (!document.querySelector('.sn-enhance-float')) { const b=document.createElement('button'); b.className='sn-enhance-float'; b.textContent='✨ Missions + Peer Help'; b.onclick=openMissions; document.body.appendChild(b); }
}
const observer = new MutationObserver(() => install());
observer.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(install,800);
