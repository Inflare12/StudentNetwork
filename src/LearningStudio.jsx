import React, { useRef, useState } from 'react';
import { BookOpen, Brain, CheckCircle2, FileText, Image as ImageIcon, Loader2, MessageCircle, Paperclip, Play, Send, Sparkles, Upload, Video, X } from 'lucide-react';
import './learning.css';

const MODEL_ID = 'onnx-community/SmolLM2-135M-Instruct-ONNX-MHA';
const MODES = ['Teach me', 'Explain simply', 'Homework coach', 'Make a quiz', 'Assess my answer', 'Summarise'];
const starter = [{ role: 'assistant', text: 'Hi! I’m your study coach. Add a chapter, syllabus, image, notes or video transcript, then tell me what you want to understand. I’ll guide you step by step instead of simply handing over homework answers.' }];

function cleanText(value) {
  return String(value || '').replace(/\u0000/g, '').replace(/[ \t]+\n/g, '\n').trim().slice(0, 12000);
}
async function readPdf(file) {
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.default;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  for (let i = 1; i <= Math.min(pdf.numPages, 18); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(' '));
  }
  return pages.join('\n\n');
}
async function readDocx(file) {
  const mammoth = await import('mammoth');
  return (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
}
async function readImage(file) {
  const tesseract = await import('tesseract.js');
  const worker = await tesseract.createWorker('eng');
  try { return (await worker.recognize(file)).data.text; }
  finally { await worker.terminate(); }
}
async function readVideoFrames(file) {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.preload = 'metadata'; video.muted = true; video.src = url;
  try {
    await new Promise((resolve, reject) => { video.onloadedmetadata = resolve; video.onerror = () => reject(new Error('This video could not be opened by your browser.')); });
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration) return 'Video opened, but its duration could not be read.';
    const tesseract = await import('tesseract.js');
    const worker = await tesseract.createWorker('eng');
    const canvas = document.createElement('canvas'); canvas.width = 960; canvas.height = 540;
    const ctx = canvas.getContext('2d'); const captured = [];
    try {
      for (const fraction of [0.08, 0.3, 0.55, 0.8]) {
        video.currentTime = Math.min(Math.max(0, duration * fraction), Math.max(0, duration - 0.15));
        await new Promise(resolve => { video.onseeked = resolve; });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const text = (await worker.recognize(canvas)).data.text.trim();
        if (text) captured.push('Frame near ' + Math.round(video.currentTime) + 's: ' + text);
      }
    } finally { await worker.terminate(); }
    return captured.length ? captured.join('\n\n') : 'No readable on-screen text was found in sampled frames. Add captions or a transcript file for a content-aware lesson.';
  } finally { URL.revokeObjectURL(url); video.removeAttribute('src'); video.load(); }
}
async function extractFile(file) {
  const name = file.name.toLowerCase();
  if (file.size > 25 * 1024 * 1024) throw new Error('Please choose a file smaller than 25 MB. Large PDFs, images and videos can use a lot of memory on phones.');
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return readPdf(file);
  if (name.endsWith('.docx')) return readDocx(file);
  if (file.type.startsWith('image/')) return readImage(file);
  if (file.type.startsWith('video/')) return readVideoFrames(file);
  if (/\.(txt|md|csv|json|vtt|srt|html|xml)$/i.test(name) || file.type.startsWith('text/')) return file.text();
  throw new Error('Unsupported file type. Try PDF, DOCX, TXT, Markdown, subtitles, an image or a browser-playable video.');
}
function fallbackReply(mode, question, source) {
  const topic = question.trim() || 'the material you uploaded';
  const excerpt = source ? source.split(/\n|[.!?]\s/).map(s => s.trim()).filter(s => s.length > 35).slice(0, 3) : [];
  if (mode === 'Make a quiz') {
    const facts = excerpt.length ? excerpt : ['Write the central idea of ' + topic + '.', 'Give one example related to ' + topic + '.', 'Explain why ' + topic + ' matters.'];
    return 'Practice quiz — answer in your own words:\n\n' + facts.slice(0, 5).map((s, i) => (i + 1) + '. Explain this idea: ' + s.slice(0, 220)).join('\n\n') + '\n\nSend your answers and choose “Assess my answer” for feedback.';
  }
  if (mode === 'Summarise') return 'Study summary starter for ' + topic + ':\n\n' + (excerpt.length ? excerpt.map(s => '• ' + s.slice(0, 240)).join('\n') : '• Write the main idea in one sentence.\n• List key terms and definitions.\n• Add one example and one question you still have.') + '\n\nThis is an offline extraction-based outline, not a verified explanation.';
  if (mode === 'Homework coach') return 'Let’s solve this together. I won’t just copy out a finished assignment.\n\n1. What is the question asking you to find or explain?\n2. Which facts, formula or idea from your notes might apply?\n3. Try the first step and send it here.\n\nI’ll check your reasoning, give a hint and help you improve it.';
  if (mode === 'Assess my answer') return 'I can review your answer, but the local fallback is not a full language model. Self-check:\n\n• Did you answer every part of the question?\n• Is each claim supported by your uploaded material?\n• Did you include a clear example or working?\n• Can you explain the idea without looking at the notes?\n\nPaste your answer and the original question for a more useful review.';
  if (mode === 'Explain simply') return 'Let’s make ' + topic + ' easier:\n\n1. Tell me which word or step feels confusing.\n2. Describe what you already understand in one sentence.\n3. We’ll connect it to a familiar example.\n\n' + (excerpt[0] ? 'Your material mentions: “' + excerpt[0].slice(0, 220) + '”.' : 'Add your notes or syllabus so I can ground the explanation in your material.');
  return 'Let’s learn ' + topic + ' in small steps.\n\n1. What do you think this topic is about?\n2. Identify two important terms from your material.\n3. Explain one example in your own words.\n4. I’ll check your understanding and then make the next step harder.\n\n' + (excerpt[0] ? 'A useful starting point from your upload: “' + excerpt[0].slice(0, 220) + '”.' : 'Upload your chapter or syllabus to make this lesson specific.');
}
export default function LearningStudio() {
  const [mode, setMode] = useState('Teach me'), [question, setQuestion] = useState('');
  const [messages, setMessages] = useState(starter), [source, setSource] = useState(''), [sourceName, setSourceName] = useState('');
  const [status, setStatus] = useState('fallback'), [modelMessage, setModelMessage] = useState('Local coach ready. Download the optional model when you want generative AI.');
  const [busy, setBusy] = useState(false), [uploading, setUploading] = useState(false), [model, setModel] = useState(null);
  const fileRef = useRef(null), endRef = useRef(null);
  async function loadModel() {
    if (model || busy) return;
    setBusy(true); setStatus('loading');
    setModelMessage('Downloading the mobile model (about 182 MB) to this device. Wi-Fi is recommended. The first download needs internet; the browser may cache it for later visits.');
    try {
      const { pipeline } = await import('@huggingface/transformers');
      let generator;
      let backend = 'wasm';
      if (typeof navigator !== 'undefined' && navigator.gpu) {
        try {
          generator = await pipeline('text-generation', MODEL_ID, { dtype: 'q4', device: 'webgpu' });
          backend = 'webgpu';
        } catch (webgpuError) {
          generator = await pipeline('text-generation', MODEL_ID, { dtype: 'q4', device: 'wasm' });
        }
      } else {
        generator = await pipeline('text-generation', MODEL_ID, { dtype: 'q4', device: 'wasm' });
      }
      setModel(generator); setStatus('ready');
      setModelMessage('SmolLM2 135M loaded with 4-bit weights using ' + backend.toUpperCase() + '. This is a compact tutor, not a frontier model. Prompts run on this device; there is no per-question AI API call.');
    } catch (error) {
      setStatus('fallback'); setModelMessage('Model could not load on this browser/device. Offline study coach remains available. ' + (error?.message || ''));
    } finally { setBusy(false); }
  }
  async function addFiles(list) {
    const file = list?.[0]; if (!file) return;
    setUploading(true); setModelMessage('Reading ' + file.name + ' on this device…');
    try {
      const extracted = cleanText(await extractFile(file));
      setSource(extracted); setSourceName(file.name);
      setMessages(old => [...old, { role: 'assistant', text: 'Added “' + file.name + '”. Extracted ' + extracted.length.toLocaleString() + ' characters of text. For video, this prototype samples a few frames for visible text; it does not understand the full video or transcribe its audio.' }]);
      setModelMessage('Material loaded locally. Your file is not uploaded to a StudentNetwork server.');
    } catch (error) { setModelMessage(error?.message || 'Could not read this file.'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  }
  async function send() {
    const prompt = question.trim(); if (!prompt || busy) return;
    const nextMessages = [...messages, { role: 'user', text: '[' + mode + '] ' + prompt }];
    setMessages(nextMessages); setQuestion(''); setBusy(true);
    try {
      let answer;
      if (model) {
        const context = source ? '\n\nSTUDENT MATERIAL (relevant excerpt):\n' + source.slice(0, 2800) : '';
        const system = 'You are StudentNetwork, a patient and accurate tutor for school students aged 10 to 18. Use simple language first. Ground claims in supplied material when possible. Teach step by step, ask questions, give hints and check understanding. For homework, guide the student instead of simply completing assessed work. Mode: ' + mode + '. Keep the answer concise and age appropriate.';
        const chat = [{ role: 'system', content: system + context }, ...nextMessages.slice(-4).map(m => ({ role: m.role, content: m.text }))];
        const result = await model(chat, { max_new_tokens: 160, temperature: 0.55, do_sample: true });
        const generated = result?.[0]?.generated_text;
        answer = Array.isArray(generated) ? (generated[generated.length - 1]?.content || '') : String(generated || '');
        answer = answer.trim() || 'I could not produce an answer. Try asking in a shorter way.';
      } else answer = fallbackReply(mode, prompt, source);
      setMessages(old => [...old, { role: 'assistant', text: answer }]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 60);
    } catch (error) {
      setMessages(old => [...old, { role: 'assistant', text: 'Local model error. Your material is still here. Try a shorter question or use the offline coach. ' + (error?.message || '') }]);
    } finally { setBusy(false); }
  }
  return <section className="learning-studio">
    <div className="learning-heading"><div><div className="eyebrow">STUDENT INTELLIGENCE · STUDY SPACE</div><h1>Your learning studio.</h1><p>Teach, practise, ask questions and work from your own learning material.</p></div><div className="learning-status"><span className={status === 'ready' ? 'status-dot on' : 'status-dot'} />{status === 'ready' ? 'On-device AI active' : status === 'loading' ? 'Loading model…' : 'Offline coach available'}</div></div>
    <div className="learning-grid">
      <aside className="learning-tools">
        <div className="learning-card"><div className="learning-card-title"><Sparkles size={17}/><b>Choose a study mode</b></div><div className="learning-modes">{MODES.map(item => <button key={item} className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>{item}</button>)}</div></div>
        <div className="learning-card"><div className="learning-card-title"><Paperclip size={17}/><b>Your materials</b></div><p className="learning-muted">Add a syllabus, chapter or lesson. Files are processed in this browser.</p><input ref={fileRef} className="file-hidden" type="file" accept=".pdf,.docx,.txt,.md,.csv,.json,.vtt,.srt,image/*,video/*" onChange={e => addFiles(e.target.files)}/><button className="upload-button" disabled={uploading} onClick={() => fileRef.current?.click()}>{uploading ? <Loader2 className="spin" size={16}/> : <Upload size={16}/>} {uploading ? 'Reading material…' : 'Upload a file'}</button>{sourceName && <div className="source-chip"><FileText size={14}/><span>{sourceName}</span><button aria-label="Remove material" onClick={() => {setSource('');setSourceName('')}}><X size={14}/></button></div>}<div className="file-support"><ImageIcon size={14}/> Images: OCR <Video size={14}/> Video: sampled frame text + subtitles <BookOpen size={14}/> PDF / DOCX / text</div></div>
        <div className="learning-card model-card"><div className="learning-card-title"><Brain size={17}/><b>Private local AI</b></div><p className="learning-muted">{modelMessage}</p><div className="model-download-note"><b>Optional download: about 182 MB</b><span>Tap the button only when you want to download it. Wi-Fi recommended. Model runs on this phone after download; no AI API fee.</span></div><button className="model-button" disabled={!!model || busy} onClick={loadModel}>{model ? <CheckCircle2 size={16}/> : <Play size={15}/>} {model ? 'Model ready on this device' : status === 'loading' ? 'Loading…' : 'Download free local model'}</button><small>No API key or per-question model fee. Initial download is about 182 MB; memory, speed and battery still depend on your phone.</small></div>
      </aside>
      <div className="learning-chat"><div className="chat-top"><div><b><Sparkles size={16}/> Study coach</b><small>{sourceName ? 'Using ' + sourceName : 'Add material to personalise your lesson'}</small></div><span className="local-badge">LOCAL FIRST</span></div>
        <div className="chat-messages">{messages.map((message, index) => <article className={'chat-message ' + message.role} key={index}><span className="message-avatar">{message.role === 'assistant' ? <Sparkles size={15}/> : 'You'}</span><div className="message-body"><b>{message.role === 'assistant' ? 'Study coach' : 'You'}</b><p>{message.text}</p></div></article>)}{busy && <div className="chat-thinking"><Loader2 className="spin" size={16}/> Thinking on this device…</div>}<div ref={endRef}/></div>
        <div className="chat-compose"><textarea value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => {if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault();send();}}} placeholder="Ask a question, paste homework, or tell me what you don't understand…" rows={2}/><button disabled={!question.trim() || busy} onClick={send}><Send size={17}/></button><small>Enter to send · Shift + Enter for a new line</small></div>
      </div>
    </div>
    <div className="learning-footnote">Learning tools are educational support, not a substitute for a teacher. Check important answers against your textbook or teacher’s instructions. The local fallback is rule-based; generative answers require the optional model download.</div>
  </section>;
}
