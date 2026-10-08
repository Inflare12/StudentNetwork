const SUBJECTS = [
  'Science','Mathematics','Social Science','English','Hindi','Computer Science','Physics','Chemistry','Biology','Geography','History','Civics','Economics','Environmental Studies','General Knowledge','Sanskrit','French','German','Spanish','Artificial Intelligence','Robotics','Coding','Information Technology','Art & Design','Music','Physical Education','Moral Education','Business Studies','Accountancy','Political Science','Psychology'
];

const SERVICES = [
  ['📚','Notes & Summaries','Turn chapters and class material into clean revision notes.'],
  ['📝','Worksheets','Find and share practice worksheets for your class and subject.'],
  ['🎯','Question Banks','Build chapter-wise questions for quick exam preparation.'],
  ['🧠','AI Study Studio','Generate notes, flashcards, quizzes and revision material.'],
  ['🃏','Flashcards','Create fast recall cards for definitions, formulas and facts.'],
  ['🏆','Mock Tests','Practice with timed tests and exam-style question sets.'],
  ['📅','Study Planner','Organise chapters, revision sessions and upcoming tests.'],
  ['🗺️','Syllabus Tracker','Track what you have completed across your school syllabus.'],
  ['🤝','Peer Help','Ask classmates for a resource or help with a difficult topic.'],
  ['💬','Study Discussions','Discuss resources, questions and study strategies safely.'],
  ['🔎','School Discovery','Explore resources through country → state → city → school → class.'],
  ['📤','Share & Earn','Contribute useful material and earn StudentNetwork points.'],
  ['🛠️','Improve Resources','Suggest corrections and create better versions without destroying originals.'],
  ['🛡️','Community Safety','Report harmful content and help keep the student community safe.'],
  ['🏫','Request a School','Ask StudentNetwork to add your school to the directory.'],
  ['📈','Progress & Streaks','Build consistent study habits with progress and activity tracking.']
];

function addSubjects() {
  document.querySelectorAll('select').forEach((select) => {
    const current = select.value;
    const isSubject = Array.from(select.options).some((o) => o.value === 'All subjects');
    if (!isSubject) return;
    const existing = new Set(Array.from(select.options).map((o) => o.value));
    SUBJECTS.forEach((subject) => {
      if (!existing.has(subject)) select.add(new Option(subject, subject));
    });
    select.value = current;
  });
}

function injectStyles() {
  if (document.getElementById('sn-services-styles')) return;
  const style = document.createElement('style');
  style.id = 'sn-services-styles';
  style.textContent = `
    .sn-services-wrap{margin-top:70px;padding-bottom:20px}
    .sn-services-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}
    .sn-services-head h2{font:700 35px 'Space Grotesk';letter-spacing:-.035em;margin:6px 0}
    .sn-services-head p{color:#697087;margin:0;line-height:1.6}
    .sn-services-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
    .sn-service{background:#fff;border:1px solid #e6e8f0;border-radius:16px;padding:19px;text-align:left;min-height:155px;box-shadow:0 7px 22px #19203d05;transition:.18s}
    .sn-service:hover{transform:translateY(-3px);border-color:#cbc8ff;box-shadow:0 12px 28px #19203d0b}
    .sn-service-icon{font-size:25px;margin-bottom:13px}
    .sn-service b{font:700 16px 'Space Grotesk';display:block;margin-bottom:7px}
    .sn-service span{font-size:12px;color:#697087;line-height:1.55}
    .sn-subjects{margin-top:24px;background:#10162b;color:#fff;border-radius:18px;padding:24px 26px}
    .sn-subjects strong{font:700 19px 'Space Grotesk'}
    .sn-subject-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}
    .sn-subject-chip{background:#ffffff0d;border:1px solid #ffffff1a;color:#dfe2ef;border-radius:99px;padding:7px 10px;font-size:11px}
    @media(max-width:900px){.sn-services-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:560px){.sn-services-grid{grid-template-columns:1fr}.sn-services-head{display:block}}
  `;
  document.head.appendChild(style);
}

function renderServices() {
  const home = document.querySelector('main');
  if (!home || document.getElementById('sn-services')) return;
  const section = document.createElement('section');
  section.id = 'sn-services';
  section.className = 'wrap sn-services-wrap';
  section.innerHTML = `
    <div class="sn-services-head">
      <div><div class="kicker">STUDENTNETWORK SERVICES</div><h2>More ways to study together</h2><p>Everything is designed around school work, collaboration and better revision.</p></div>
    </div>
    <div class="sn-services-grid">${SERVICES.map(([icon,title,text]) => `<button class="sn-service" type="button"><div class="sn-service-icon">${icon}</div><b>${title}</b><span>${text}</span></button>`).join('')}</div>
    <div class="sn-subjects"><strong>More subjects are now supported</strong><div class="sn-subject-chips">${SUBJECTS.map((s) => `<span class="sn-subject-chip">${s}</span>`).join('')}</div></div>
  `;
  home.appendChild(section);
}

function run() {
  injectStyles();
  addSubjects();
  renderServices();
}

run();
new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
