import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Search, Upload, Home, Brain, Gift, School, User, LogOut, ChevronRight, Plus, FileText, FlaskConical, Clock3, Star, ShieldCheck, Sparkles, Menu, X, ArrowRight, CheckCircle2, LockKeyhole, Mail, MapPin, Trophy, Settings, Trash2, Download, PlayCircle, Heart, Eye, Users } from 'lucide-react';
import './styles.css';

const SEED_SCHOOLS = [
  { id: 'bbl', name: 'BBL Public School', city: 'Agra', state: 'Uttar Pradesh', country: 'India', students: 842 },
  { id: 'dpsd', name: 'Delhi Public School', city: 'Delhi', state: 'Delhi', country: 'India', students: 1260 },
  { id: 'dav', name: 'DAV Public School', city: 'Jaipur', state: 'Rajasthan', country: 'India', students: 734 },
  { id: 'stx', name: 'St. Xavier’s School', city: 'Kolkata', state: 'West Bengal', country: 'India', students: 916 }
];

const SEED_RESOURCES = [
  { id: 1, title: 'Nutrition in Plants — Quick Notes', subject: 'Science', className: 'Class 7', school: 'BBL Public School', type: 'Notes', author: 'Aarav', points: 35, downloads: 128, created: '2h ago', color: 'violet' },
  { id: 2, title: 'Integers Practice Worksheet', subject: 'Mathematics', className: 'Class 7', school: 'BBL Public School', type: 'Worksheet', author: 'Meera', points: 25, downloads: 86, created: '5h ago', color: 'blue' },
  { id: 3, title: 'The Mughal Empire — Revision Pack', subject: 'Social Science', className: 'Class 7', school: 'Delhi Public School', type: 'Revision', author: 'Kabir', points: 45, downloads: 214, created: '1d ago', color: 'amber' },
  { id: 4, title: 'English Grammar: Tenses Test', subject: 'English', className: 'Class 7', school: 'BBL Public School', type: 'Test', author: 'Ananya', points: 30, downloads: 61, created: '1d ago', color: 'emerald' },
  { id: 5, title: 'Heat & Temperature — Exam Questions', subject: 'Science', className: 'Class 7', school: 'DAV Public School', type: 'Question Bank', author: 'Vihaan', points: 40, downloads: 174, created: '2d ago', color: 'rose' }
];

const DEMO_USER = { id: 'demo', name: 'Kunj', email: 'demo@studentnetwork.app', password: 'demo123', school: 'BBL Public School', className: 'Class 7', points: 1240, streak: 7 };

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

function App() {
  const [user, setUser] = useState(() => readJSON('sn_user', null));
  const [users, setUsers] = useState(() => readJSON('sn_users', { demo: DEMO_USER }));
  const [resources, setResources] = useState(() => readJSON('sn_resources', SEED_RESOURCES));
  const [schools, setSchools] = useState(() => readJSON('sn_schools', SEED_SCHOOLS));
  const [page, setPage] = useState('home');
  const [auth, setAuth] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => localStorage.setItem('sn_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('sn_resources', JSON.stringify(resources)), [resources]);
  useEffect(() => localStorage.setItem('sn_schools', JSON.stringify(schools)), [schools]);
  useEffect(() => { if (user) localStorage.setItem('sn_user', JSON.stringify(user)); else localStorage.removeItem('sn_user'); }, [user]);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2800);
  };

  const navigate = (next) => {
    setPage(next);
    setMobile(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email, password) => {
    const found = Object.values(users).find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!found) return false;
    setUser(found);
    setAuth(null);
    notify(`Welcome back, ${found.name}!`);
    return true;
  };

  const signup = (data) => {
    if (Object.values(users).some((item) => item.email.toLowerCase() === data.email.trim().toLowerCase())) return false;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`;
    const created = { ...data, id, email: data.email.trim(), points: 100, streak: 0 };
    setUsers((previous) => ({ ...previous, [id]: created }));
    setUser(created);
    setAuth(null);
    notify('Account created — welcome to StudentNetwork!');
    return true;
  };

  const addPoints = (amount) => {
    if (!user) return;
    const updated = { ...user, points: (user.points || 0) + amount };
    setUser(updated);
    setUsers((previous) => ({ ...previous, [updated.id]: updated }));
  };

  const addResource = (resource) => {
    setResources((previous) => [resource, ...previous]);
    addPoints(resource.points);
    notify(`Published! +${resource.points} points added.`);
    navigate('library');
  };

  const logout = () => { setUser(null); navigate('home'); notify('Signed out.'); };

  return (
    <div className="app">
      <Header user={user} page={page} navigate={navigate} openAuth={() => setAuth('login')} logout={logout} mobile={mobile} setMobile={setMobile} />
      {page === 'home' && <HomePage user={user} navigate={navigate} resources={resources} />}
      {page === 'explore' && <Explore resources={resources} schools={schools} user={user} navigate={navigate} openViewer={setViewer} />}
      {page === 'upload' && <UploadPage user={user} schools={schools} addResource={addResource} openAuth={() => setAuth('login')} />}
      {page === 'library' && <Library resources={resources} user={user} navigate={navigate} openViewer={setViewer} />}
      {page === 'ai' && <AIStudio user={user} openAuth={() => setAuth('login')} notify={notify} />}
      {page === 'rewards' && <Rewards user={user} openAuth={() => setAuth('login')} />}
      {page === 'profile' && <Profile user={user} schools={schools} setUser={setUser} setUsers={setUsers} openAuth={() => setAuth('login')} />}
      {page === 'request' && <SchoolRequest schools={schools} setSchools={setSchools} notify={notify} navigate={navigate} />}
      <Footer navigate={navigate} />
      {auth && <AuthModal mode={auth} setMode={setAuth} login={login} signup={signup} />}
      {viewer && <ResourceViewer resource={viewer} close={() => setViewer(null)} />}
      {toast && <div className={`toast ${toast.type}`}><CheckCircle2 size={18} />{toast.message}</div>}
    </div>
  );
}

function Header({ user, page, navigate, openAuth, logout, mobile, setMobile }) {
  const links = [['home', 'Home'], ['explore', 'Explore'], ['library', 'My Library'], ['ai', 'AI Studio'], ['rewards', 'Rewards']];
  return (
    <header className="header"><div className="nav wrap">
      <button className="brand" onClick={() => navigate('home')}><span className="logo"><BookOpen size={22} /></span><span>Student<span className="brand-accent">Network</span></span></button>
      <nav className={mobile ? 'navlinks open' : 'navlinks'}>{links.map(([id, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => navigate(id)}>{label}</button>)}</nav>
      <div className="navright">
        {user ? <><button className="points-pill" onClick={() => navigate('rewards')}><Gift size={15} />{user.points || 0}</button><button className="avatar" onClick={() => navigate('profile')}>{user.name?.[0] || 'U'}</button><button className="desktop-only iconbtn" onClick={logout} title="Sign out"><LogOut size={18} /></button></> : <button className="signin" onClick={openAuth}>Sign in <ArrowRight size={16} /></button>}
        <button className="mobile-menu" onClick={() => setMobile(!mobile)}>{mobile ? <X /> : <Menu />}</button>
      </div>
    </div></header>
  );
}

function HomePage({ user, navigate, resources }) {
  return <main>
    <section className="hero"><div className="hero-glow" /><div className="wrap hero-inner">
      <div className="eyebrow"><Sparkles size={15} /> THE STUDENT ACADEMIC NETWORK</div>
      <h1>Your school work.<br /><span>Your community.</span></h1>
      <p>Find notes, worksheets and tests from students like you. Share useful work, earn points, and build a smarter study routine.</p>
      <div className="hero-actions"><button className="primary" onClick={() => navigate('explore')}>Explore resources <ArrowRight size={18} /></button><button className="secondary" onClick={() => navigate(user ? 'upload' : 'explore')}><Upload size={17} /> Share your work</button></div>
      <div className="trust"><div className="avatars"><i>AK</i><i>MS</i><i>RV</i><i>+</i></div><span><b>School-first</b> discovery for students</span></div>
    </div></section>
    <section className="wrap stats"><Stat n="5+" l="Starter resources" /><Stat n="4" l="Starter schools" /><Stat n="7" l="Core flows" /><Stat n="100%" l="Free beta" /></section>
    <section className="wrap section"><div className="section-head"><div><div className="kicker">BUILT FOR STUDENTS</div><h2>Everything you need to test the idea</h2></div><button className="textbtn" onClick={() => navigate('explore')}>Explore <ChevronRight size={16} /></button></div><div className="feature-grid"><Feature icon={<School />} title="Your school, first" text="Browse by country, state, city, school, class and subject." onClick={() => navigate('explore')} /><Feature icon={<Upload />} title="Share & earn" text="Publish useful study material and build your contributor score." onClick={() => navigate('upload')} /><Feature icon={<Brain />} title="AI Study Studio" text="Generate revision notes, flashcards and practice material." onClick={() => navigate('ai')} /></div></section>
    <section className="wrap section split"><div><div className="kicker">COMMUNITY LIBRARY</div><h2>Popular starter resources</h2><p className="muted">These starter entries make the beta immediately testable.</p></div><div className="mini-list">{resources.slice(0, 3).map((resource) => <ResourceRow key={resource.id} resource={resource} onClick={() => navigate('library')} />)}</div></section>
    <section className="wrap cta"><div><div className="kicker">CAN'T FIND YOUR SCHOOL?</div><h2>Request it.</h2><p>Tell us where you study and we can add it to the directory.</p></div><button className="secondary" onClick={() => navigate('request')}>Request a school <ArrowRight size={17} /></button></section>
  </main>;
}

const Stat = ({ n, l }) => <div><strong>{n}</strong><span>{l}</span></div>;
const Feature = ({ icon, title, text, onClick }) => <button className="feature" onClick={onClick}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p><span className="feature-arrow"><ArrowRight size={17} /></span></button>;
const ResourceRow = ({ resource, onClick }) => <button className="resource-row" onClick={onClick}><span className={`docicon ${resource.color}`}><FileText size={20} /></span><span className="grow"><b>{resource.title}</b><small>{resource.subject} · {resource.className} · {resource.author}</small></span><span className="row-points">+{resource.points}</span><ChevronRight size={16} /></button>;

function Explore({ resources, schools, user, navigate, openViewer }) {
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState('All schools');
  const [subject, setSubject] = useState('All subjects');
  const [className, setClassName] = useState('All classes');
  const filtered = useMemo(() => resources.filter((item) => {
    const haystack = `${item.title} ${item.subject} ${item.school} ${item.author}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (school === 'All schools' || item.school === school) && (subject === 'All subjects' || item.subject === subject) && (className === 'All classes' || item.className === className);
  }), [resources, query, school, subject, className]);
  return <main className="wrap page">
    <div className="page-top"><div><div className="kicker">DISCOVER</div><h1>Find your school work</h1><p>Search the starter directory and narrow it down to exactly what you need.</p></div><button className="primary" onClick={() => navigate(user ? 'upload' : 'home')}><Upload size={17} /> Upload resource</button></div>
    <div className="searchbar"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes, worksheets, chapters..." /></div>
    <div className="filters"><Select value={school} set={setSchool} options={['All schools', ...schools.map((item) => item.name)]} /><Select value={subject} set={setSubject} options={['All subjects', 'Science', 'Mathematics', 'Social Science', 'English', 'Hindi', 'Computer']} /><Select value={className} set={setClassName} options={['All classes', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']} /></div>
    <div className="school-chips">{schools.map((item) => <button key={item.id} onClick={() => setSchool(item.name)}><School size={15} /><span>{item.name}<small>{item.city} · {item.students} students</small></span></button>)}</div>
    <div className="results-head"><b>{filtered.length} resources</b><span>Starter beta library</span></div>
    <div className="resource-grid">{filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} onOpen={() => openViewer(resource)} />)}</div>
    {!filtered.length && <Empty title="Nothing found" text="Try another keyword or reset one of the filters." />}
  </main>;
}

const Select = ({ value, set, options }) => <select value={value} onChange={(e) => set(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>;

function ResourceCard({ resource, onOpen }) {
  return <article className="resource-card"><div className="card-top"><span className={`type ${resource.color}`}>{resource.type}</span><span className="points">+{resource.points} pts</span></div><h3>{resource.title}</h3><p>{resource.subject} · {resource.className}</p><div className="schoolline"><School size={14} />{resource.school}</div><div className="card-foot"><span><User size={13} />{resource.author}</span><span><Download size={13} />{resource.downloads}</span><span>{resource.created}</span></div><button className="outline full" onClick={onOpen}><PlayCircle size={15} /> Open resource</button></article>;
}

function ResourceViewer({ resource, close }) {
  return <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && close()}><div className="modal resource-modal"><button className="modal-close" onClick={close}><X /></button><span className={`type ${resource.color}`}>{resource.type}</span><h2>{resource.title}</h2><p>{resource.subject} · {resource.className} · {resource.school}</p><div className="viewer-paper"><h3>Preview</h3><p>This is a beta preview for <b>{resource.title}</b>. The production version will open the student's uploaded PDF/image/document from shared storage.</p><div className="preview-lines"><i /><i /><i /><i /><i /></div></div><div className="viewer-actions"><button className="outline"><Heart size={16} /> Helpful</button><button className="primary"><Download size={16} /> Save to library</button></div></div></div>;
}

function UploadPage({ user, schools, addResource, openAuth }) {
  const [form, setForm] = useState({ title: '', subject: 'Science', className: user?.className || 'Class 7', school: user?.school || schools[0]?.name || '', type: 'Notes' });
  const [file, setFile] = useState(null);
  if (!user) return <AuthGate title="Share your work" text="Sign in to upload resources and earn contributor points." openAuth={openAuth} />;
  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !file) return;
    addResource({ id: Date.now(), ...form, author: user.name, points: form.type === 'Notes' ? 35 : form.type === 'Revision' ? 45 : 25, downloads: 0, created: 'just now', color: 'violet', fileName: file.name });
  };
  return <main className="wrap page narrow"><div className="page-top"><div><div className="kicker">CONTRIBUTE</div><h1>Share something useful</h1><p>Help another student and earn points for every contribution.</p></div><div className="earn"><Gift size={17} /> Earn points</div></div><form className="form-card" onSubmit={submit}><label>Resource title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Light — Quick Revision Notes" /></label><div className="form-row"><label>Subject<Select value={form.subject} set={(value) => setForm({ ...form, subject: value })} options={['Science', 'Mathematics', 'Social Science', 'English', 'Hindi', 'Computer']} /></label><label>Class<Select value={form.className} set={(value) => setForm({ ...form, className: value })} options={['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']} /></label></div><div className="form-row"><label>School<Select value={form.school} set={(value) => setForm({ ...form, school: value })} options={schools.map((item) => item.name)} /></label><label>Type<Select value={form.type} set={(value) => setForm({ ...form, type: value })} options={['Notes', 'Worksheet', 'Test', 'Revision', 'Question Bank']} /></label></div><label className="dropzone"><Upload size={28} /><b>{file ? file.name : 'Choose your study material'}</b><span>{file ? 'Ready to publish' : 'PDF, image or document · up to 10 MB'}</span><input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label><div className="notice"><ShieldCheck size={17} /><span>Only upload work you have permission to share. Reported content can be removed.</span></div><button className="primary full" type="submit" disabled={!file || !form.title.trim()}>Publish resource <ArrowRight size={17} /></button></form></main>;
}

function Library({ resources, user, navigate, openViewer }) {
  const mine = user ? resources.filter((item) => item.author === user.name) : [];
  return <main className="wrap page"><div className="page-top"><div><div className="kicker">YOUR LIBRARY</div><h1>Study resources</h1><p>Explore the beta library and see your own contributions.</p></div><button className="primary" onClick={() => navigate('upload')}><Plus size={17} /> Add resource</button></div><div className="library-tabs"><button className="active">All resources <span>{resources.length}</span></button><button>My uploads <span>{mine.length}</span></button></div><div className="resource-grid">{resources.map((resource) => <ResourceCard key={resource.id} resource={resource} onOpen={() => openViewer(resource)} />)}</div></main>;
}

function AIStudio({ user, openAuth, notify }) {
  const [tab, setTab] = useState('notes');
  const [topic, setTopic] = useState('Nutrition in Plants');
  const [grade, setGrade] = useState(user?.className || 'Class 7');
  const [source, setSource] = useState('NCERT Science');
  const [generated, setGenerated] = useState(false);
  if (!user) return <AuthGate title="AI Study Studio" text="Sign in to create personalized notes, flashcards and tests." openAuth={openAuth} />;
  const generate = () => { setGenerated(true); notify('Study pack generated in beta mode.'); };
  return <main className="wrap page"><div className="ai-hero"><div><div className="kicker">AI STUDY STUDIO</div><h1>Study material that matches <span>your syllabus.</span></h1><p>Choose a class, book and topic to test the study-material workflow.</p></div><div className="ai-orb"><Brain size={42} /></div></div><div className="ai-layout"><aside className="ai-sidebar"><b>CREATE</b>{[['notes', 'Notes', FileText], ['flashcards', 'Flashcards', Brain], ['quiz', 'Quiz', FlaskConical], ['exam', 'Mock exam', Clock3]].map(([id, label, Icon]) => <button className={tab === id ? 'sel' : ''} onClick={() => { setTab(id); setGenerated(false); }} key={id}><Icon size={17} />{label}</button>)}<div className="ai-tip"><Sparkles size={17} /><b>Beta</b><p>The current generator is intentionally local. The production AI layer will be connected after the beta feedback round.</p></div></aside><section className="ai-builder"><div className="builder-head"><div><h2>{tab === 'notes' ? 'Create notes' : tab === 'flashcards' ? 'Create flashcards' : tab === 'quiz' ? 'Create a quiz' : 'Create a mock exam'}</h2><span>Personalized for your profile</span></div><span className="pro-pill">BETA</span></div><div className="form-row"><label>Class<Select value={grade} set={setGrade} options={['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']} /></label><label>Source book<input value={source} onChange={(e) => setSource(e.target.value)} /></label></div><label>Topic or chapter<input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Acids, Bases and Salts" /></label><label>Focus<textarea defaultValue="Exam-ready explanations, key definitions, examples and common mistakes." /></label><button className="primary full" onClick={generate}><Sparkles size={17} /> Generate study pack</button>{generated && <Generated tab={tab} topic={topic} grade={grade} />}</section></div></main>;
}

function Generated({ tab, topic, grade }) {
  const cards = ['What is photosynthesis?', 'Why do leaves look green?', 'What is chlorophyll?', 'Where does a plant get carbon dioxide?', 'Define autotrophic nutrition.'];
  return <div className="generated"><div className="generated-head"><div><span className="type violet">GENERATED</span><h3>{topic} · {grade}</h3></div><button className="outline">Save pack</button></div>{tab === 'notes' ? <><div className="answer"><h4>Quick revision</h4><p>Plants make their own food using light energy, carbon dioxide and water. Chlorophyll captures light energy and glucose is produced during photosynthesis.</p></div><div className="answer"><h4>Remember</h4><ul><li>Photosynthesis happens mainly in green leaves.</li><li>Carbon dioxide enters through stomata.</li><li>Oxygen is released as a by-product.</li></ul></div></> : <div className="flash-preview">{cards.map((card, index) => <div key={card}><span>{index + 1}</span><b>{card}</b><small>Tap to reveal answer</small></div>)}</div>}<div className="generated-note"><CheckCircle2 size={16} /> Beta content should be checked against your school textbook.</div></div>;
}

function Rewards({ user, openAuth }) {
  if (!user) return <AuthGate title="Rewards" text="Sign in to see your points and contributor progress." openAuth={openAuth} />;
  const tiers = [['Bronze', 500, 'Profile badge'], ['Silver', 1500, 'Exclusive theme'], ['Gold', 3000, 'Future reward tier'], ['Scholar', 7500, 'Future reward tier']];
  return <main className="wrap page"><div className="rewards-banner"><div><div className="kicker">YOUR CONTRIBUTION</div><h1>{user.points || 0} points</h1><p>Share useful work and build your contributor score.</p></div><div className="trophy"><Trophy size={48} /></div></div><div className="reward-grid"><section className="panel"><h2>How points work</h2><div className="pointline"><Upload />Upload notes <b>+35</b></div><div className="pointline"><FileText />Upload worksheet <b>+25</b></div><div className="pointline"><Star />Helpful reaction <b>+5</b></div><div className="pointline"><Gift />Study streak <b>+10</b></div></section><section className="panel"><h2>Reward levels</h2>{tiers.map(([name, threshold, description], index) => <div className={`tier ${(user.points || 0) >= threshold ? 'unlocked' : ''}`} key={name}><span>{index + 1}</span><div><b>{name}</b><small>{threshold.toLocaleString()} pts · {description}</small></div>{(user.points || 0) >= threshold && <CheckCircle2 size={18} />}</div>)}</section></div><div className="notice"><ShieldCheck size={17} /><span>Points and rewards are beta-only. No real gift cards or cash are issued yet.</span></div></main>;
}

function Profile({ user, schools, setUser, setUsers, openAuth }) {
  if (!user) return <AuthGate title="Your profile" text="Sign in to manage your StudentNetwork profile." openAuth={openAuth} />;
  const save = (event) => { event.preventDefault(); setUsers((previous) => ({ ...previous, [user.id]: user })); localStorage.setItem('sn_user', JSON.stringify(user)); };
  return <main className="wrap page narrow"><div className="profile-head"><div className="big-avatar">{user.name?.[0] || 'U'}</div><div><div className="kicker">PROFILE</div><h1>{user.name}</h1><p>{user.school} · {user.className}</p></div><div className="profile-stat"><b>{user.points || 0}</b><span>points</span></div></div><form className="form-card" onSubmit={save}><h2>Account details</h2><label>Display name<input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} /></label><label>Email<input value={user.email} disabled /></label><div className="form-row"><label>School<Select value={user.school} set={(value) => setUser({ ...user, school: value })} options={schools.map((item) => item.name)} /></label><label>Class<Select value={user.className} set={(value) => setUser({ ...user, className: value })} options={['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']} /></label></div><button className="primary">Save changes <CheckCircle2 size={16} /></button></form><div className="danger"><Settings size={18} /><div><b>Beta account</b><p>Your current beta profile is stored in this browser. Shared accounts will be moved to managed authentication in the next backend stage.</p></div></div></main>;
}

function SchoolRequest({ schools, setSchools, notify, navigate }) {
  const [form, setForm] = useState({ name: '', city: '', state: '', country: 'India' });
  const submit = (event) => { event.preventDefault(); if (!form.name.trim()) return; setSchools((previous) => [...previous, { ...form, id: `pending-${Date.now()}`, students: 0, pending: true }]); notify('School request submitted for review.'); navigate('home'); };
  return <main className="wrap page narrow"><div className="page-top"><div><div className="kicker">SCHOOL DIRECTORY</div><h1>Request a school</h1><p>Can't find your school? Send us the details.</p></div></div><form className="form-card" onSubmit={submit}><label>School name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sunrise Public School" /></label><div className="form-row"><label>Country<input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></label><label>State<input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></label></div><label>City<input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label><label>Context<textarea placeholder="Optional: school website, board, or reason" /></label><button className="primary full">Submit request <ArrowRight size={17} /></button></form></main>;
}

const AuthGate = ({ title, text, openAuth }) => <main className="authgate wrap"><div className="gate-icon"><LockKeyhole size={30} /></div><h1>{title}</h1><p>{text}</p><button className="primary" onClick={openAuth}>Sign in / create account <ArrowRight size={17} /></button></main>;

function AuthModal({ mode, setMode, login, signup }) {
  const [form, setForm] = useState(mode === 'login' ? { email: 'demo@studentnetwork.app', password: 'demo123' } : { name: '', email: '', password: '', school: 'BBL Public School', className: 'Class 7' });
  const [error, setError] = useState('');
  const submit = (event) => { event.preventDefault(); const ok = mode === 'login' ? login(form.email, form.password) : signup(form); if (!ok) setError(mode === 'login' ? 'Incorrect email or password.' : 'An account with this email already exists.'); };
  const switchMode = () => { setError(''); if (mode === 'login') { setMode('signup'); setForm({ name: '', email: '', password: '', school: 'BBL Public School', className: 'Class 7' }); } else { setMode('login'); setForm({ email: 'demo@studentnetwork.app', password: 'demo123' }); } };
  return <div className="modal-bg"><div className="modal"><button className="modal-close" onClick={() => setMode(null)}><X /></button><div className="modal-logo"><span className="logo"><BookOpen size={20} /></span><b>Student<span>Network</span></b></div><h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'login' ? 'Continue your learning journey.' : 'Join your school community in minutes.'}</p><form onSubmit={submit}>{mode === 'signup' && <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>}<label><Mail size={14} /> Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>{mode === 'signup' && <div className="form-row"><label>School<Select value={form.school} set={(value) => setForm({ ...form, school: value })} options={SEED_SCHOOLS.map((item) => item.name)} /></label><label>Class<Select value={form.className} set={(value) => setForm({ ...form, className: value })} options={['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']} /></label></div>}{error && <div className="error">{error}</div>}<button className="primary full" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></button></form>{mode === 'login' && <div className="demo-login"><b>Demo account</b><span>demo@studentnetwork.app · demo123</span></div>}<p className="switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button type="button" onClick={switchMode}>{mode === 'login' ? 'Sign up' : 'Sign in'}</button></p></div></div>;
}

const Empty = ({ title, text }) => <div className="empty"><Search size={28} /><h3>{title}</h3><p>{text}</p></div>;

function Footer({ navigate }) {
  return <footer><div className="wrap footer-grid"><div><button className="brand footerbrand" onClick={() => navigate('home')}><span className="logo"><BookOpen size={20} /></span>Student<span className="brand-accent">Network</span></button><p>Students helping students learn better.</p></div><div><b>Product</b><button onClick={() => navigate('explore')}>Explore</button><button onClick={() => navigate('ai')}>AI Studio</button><button onClick={() => navigate('rewards')}>Rewards</button></div><div><b>Community</b><button onClick={() => navigate('upload')}>Share work</button><button onClick={() => navigate('request')}>Request school</button><button onClick={() => navigate('profile')}>Profile</button></div><div><b>Beta</b><p className="small">This release is designed for feedback and classroom testing. Shared backend accounts, moderation, storage and live AI are the next production stage.</p></div></div><div className="wrap copyright">© 2026 StudentNetwork · Built for learning together</div></footer>;
}

createRoot(document.getElementById('root')).render(<App />);
