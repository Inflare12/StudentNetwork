# StudentNetwork — 20 November release checklist

This checklist is for the reviewable MVP candidate targeted for 19 November 2026. A checked item means it was actually tested; a successful deployment alone does not prove the user flows work.

## Automated checks
- [ ] GitHub Actions production build passes on the release-candidate commit.
- [ ] Vercel preview deployment for the same commit reaches READY.
- [ ] No build errors or unresolved high-priority runtime errors.

## Core student flows
- [ ] Fresh visitor can complete nickname-only onboarding.
- [ ] Refresh preserves the local profile and progress.
- [ ] With browser storage blocked, onboarding and the core app remain usable in-session and a clear warning explains that progress will not survive refresh.
- [ ] Daily missions award XP once per mission and reset on the next local calendar day.
- [ ] Skill selection, starter/custom projects and reflections save and reload.
- [ ] Study templates produce the expected local prompts.
- [ ] Privacy page accurately describes current storage and feature limits.
- [ ] Clear-local-data control removes the local profile and returns to onboarding without recreating the saved profile key.

## AI Study Studio and files
- [ ] AI Study Studio is loaded only when opened; the model is not fetched until the student explicitly taps download.
- [ ] Rule-based fallback works without downloading a model.
- [ ] Model download is opt-in and clearly states its approximate 182 MB size.
- [ ] SmolLM2 runs on a real supported Android device; record browser, backend (WebGPU/WASM), load time and observed failures.
- [ ] iOS Safari is tested separately; do not assume WebGPU support.
- [ ] PDF, DOCX, TXT/Markdown/subtitles and image OCR are tested with sample files.
- [ ] Video sampling is tested with a short supported video; explain that it does not transcribe audio.
- [ ] Confirm files up to 25 MB are handled and files above 25 MB fail with a readable message on desktop and phone.
- [ ] Network inspection confirms selected document contents are not sent to a StudentNetwork backend.

## Mobile, accessibility and PWA
- [ ] Test at 320 px, 375 px and tablet widths.
- [ ] Navigation and all main actions work with touch and keyboard.
- [ ] Focus indicators and form labels are visible and usable.
- [ ] Install prompt / add-to-home-screen flow works where supported.
- [ ] App shell opens offline after a successful first visit; dynamic model downloads are not assumed to be offline-ready.

## Privacy and launch gates
- [ ] No public profiles, direct messages, live leaderboard, analytics or ad scripts are represented as active.
- [ ] No full names, phone numbers, home addresses, school names or sensitive student data are requested.
- [ ] A parent/guardian reviews privacy, child/teen requirements and any future publisher account before monetisation.
- [ ] Do not enable advertising until the adult-owned publisher account, applicable policies, disclosures and suitable commercial hosting are confirmed.
- [ ] Do not create a backend or collect shared student data without explicit approval and a privacy/consent/moderation plan.

## Release decision
- [ ] On 19 November, freeze features and review all failed/untested items.
- [ ] Publish the exact preview URL and commit SHA for the user's inspection.
- [ ] Launch on 20 November only as the clearly described MVP if core checks pass and all remaining limitations are disclosed.

## Current known limitations
- Profile and progress are browser-local; there are no accounts or cross-device sync.
- XP and mission completion are self-reported, not verified achievements.
- Opportunities are categories to investigate, not confirmed open registrations.
- File imports are capped at 25 MB to reduce memory pressure on phones.
- The local language model is small and may be slow or inaccurate; important answers must be checked.
- Image processing is OCR; video processing samples visible text and does not transcribe speech.
- No real ads or monetisation are enabled.
