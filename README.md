# StudentNetwork

StudentNetwork is a mobile-first student growth workspace for ages 10–18. This repository contains an early, browser-local MVP for a review launch targeted for 20 November 2026. It is **not** a shared social network or a fully reviewed service for children.

## What is included

- Nickname-only onboarding with an age band, goal and daily time preference.
- Dashboard, daily missions, self-reported XP/levels/streaks and skill interests.
- Starter project roadmaps, private browser-local reflections and portfolio notes.
- Opportunity categories with reminders to verify eligibility and dates with an adult; these are not live listings.
- Copyable friend-challenge prompts; these do not create rooms or shared activity.
- Study templates and an optional AI Study Studio.

## AI Study Studio and file imports

The Study Studio has two paths:

1. **No-model study coach:** a deterministic, rule-based fallback for study prompts, quizzes, summaries and homework coaching. It is not generative AI.
2. **Optional on-device model:** SmolLM2-135M-Instruct ONNX MHA, 4-bit (q4), approximately 182 MB. The app attempts WebGPU and falls back to WASM. The model is fetched only after the student explicitly presses the download button. It is a very small model and can be slow, inaccurate or unsupported on some devices. Actual Android/iOS inference has not been certified.

There is no per-question hosted AI API call, but downloads still use network data and hosting/CDN bandwidth. Model files may be cached by the browser and are not removed by the in-app profile-clearing control.

The Study Studio accepts PDF (up to the first 18 pages are extracted), DOCX, TXT/Markdown/CSV/JSON, VTT/SRT subtitles, images and browser-playable videos. The upload limit is 25 MB. Image and sampled video-frame processing use English OCR. Video processing samples a few frames for visible text; it does **not** transcribe speech or understand the full scene. OCR may fetch language resources from a third-party content host.

Selected document contents are processed in the browser; this version has no StudentNetwork upload endpoint or student database. Browser/device memory, third-party resource downloads and model compatibility still matter.

## Data, privacy and safety

- There are no online accounts, authentication, shared database, cross-device sync, public profiles, direct messages, live leaderboards or real-time challenge rooms.
- Profile details, age band, goal, daily time preference, XP, streak, completed missions, selected skills, project notes and reflections are stored in this browser's localStorage.
- Anyone with access to the browser profile/device may be able to see this local information. Browser settings or clearing site data can remove it.
- The in-app clear-data action removes the StudentNetwork profile/progress key and returns to onboarding; it does not clear the browser-managed model cache.
- No advertising scripts or analytics are enabled. The long-term business direction may be free-to-use and ad-supported, but advertising and revenue are **not** launch-ready.

Use a nickname only. Do not enter real names, school names, phone numbers, home addresses, passwords, private records or information about another person. Because the intended audience includes minors, a parent/guardian and appropriate adult policy/privacy review is required before a public service or any monetisation is approved. Do not add accounts, student-data collection, ads or a backend without an explicit product/privacy decision and suitable consent, moderation, reporting, retention and deletion controls.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Run automated tests and create a production build:

\`\`\`bash
npm test
npm run build
\`\`\`

The app uses Vite + React and a static client-side deployment. No paid inference service, database or server-side model is configured. Dependency versions are not fully pinned and no lockfile is committed in this MVP, so a future install may resolve different package versions; run CI and review dependency changes before relying on a rebuilt release.

## Honest MVP limitations

- XP and mission completion are self-reported motivation features, not verified achievements.
- Opportunities are examples/categories to investigate, not confirmed open registrations.
- The offline study fallback is rule-based, not generative AI.
- The optional 135M model is limited; important answers must be checked against textbooks or teachers.
- OCR is not full image understanding; video sampling is not speech transcription.
- PWA app-shell caching is best-effort after a successful visit. It does not guarantee offline model or OCR-resource availability.
- Real-device browser flows, accessibility, model inference and offline behaviour still require Android/iOS and assistive-technology testing.

See [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) for the release verification record and outstanding checks.

## Product principle

Reward meaningful progress, not app opens. Keep personal progress private, avoid pressure from public rankings, and do not ask students to disclose more personal information than the MVP needs.
