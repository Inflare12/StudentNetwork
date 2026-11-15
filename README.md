# StudentNetwork

StudentNetwork is a student growth workspace for ages 10–18. The current MVP focuses on small, useful actions rather than an endless feed.

## Included in this MVP

- Nickname-only onboarding with broad age bands and daily time preference.
- Daily missions across learning, thinking, creativity, communication, collaboration, discovery and projects.
- XP, levels, daily completion tracking and a streak indicator.
- Skill-interest selection.
- Starter project roadmaps and a private portfolio with reflections.
- Opportunity discovery categories with explicit eligibility-verification reminders.
- Shareable challenge prompts.
- Offline study templates (revision checklist, flashcard prompts and practice prompts).

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Build:

\`\`\`bash
npm run build
\`\`\`

## Zero-cost architecture

This version is deliberately static and client-side:
- Vite + React for the app.
- Vercel static hosting.
- Browser localStorage for the current device's demo profile and progress.
- No AI API, paid inference, database, email login or server-side model.
- Study prompts are deterministic templates, not AI-generated answers.

This avoids API bills and keeps the first experiment inexpensive. It also means progress does **not** sync across devices or between students. A browser-local XP score is self-reported and must not be treated as a verified achievement.

## AI without per-request API costs

Do not try to host a language model inside a Vercel serverless function for this first release. Serverless functions have execution, memory, bundle and cold-start constraints; model inference can be slow and expensive in compute even when no external model API is called.

A later experiment can use a small quantized model in the browser through WebGPU/WebAssembly (for example, a Transformers.js-compatible ONNX model). The model is downloaded to each student's device and inference happens locally:
- no per-token provider bill;
- no model inference server to pay for;
- user-device performance and memory become the limits;
- first download can be large, and low-end phones may struggle.

Before adding a local model, test it on budget Android phones and provide a no-model fallback. For missions, recommendations and progress summaries, deterministic rules may be better, faster and more reliable than an LLM.

## Important production limitations

This is an early product-validation MVP, not a fully shared student network:
- Profile, XP, selected skills, projects and reflections are stored only in the current browser.
- There is no real authentication, shared database, live multiplayer, real-time leaderboard, file upload or cross-device sync.
- Challenge sharing copies a prompt; it does not create a live room.
- Opportunity cards are categories to investigate, not live or verified listings.
- Mission completion is self-reported. XP is for motivation, not certification.

Do not collect full names, home addresses, phone numbers, school email addresses or other sensitive information in this prototype. Before introducing accounts, uploads, messaging, public profiles or leaderboards for minors, implement appropriate consent, privacy controls, moderation, reporting, retention and deletion processes.

## Product principle

Reward meaningful progress, not app opens. Keep challenges age-appropriate, make personal progress more important than public rankings, and let students participate without sharing personal information.
