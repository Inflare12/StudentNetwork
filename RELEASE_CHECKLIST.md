# StudentNetwork — 20 November release checklist

This checklist records the reviewable MVP candidate targeted for 19 November 2026. A checked item means it was actually tested; a successful deployment alone does not prove the user flows work.

## 19 November freeze and verification record

- Feature scope is frozen. The 19 November changes are documentation-only; no new app feature or backend was introduced after the 18 November application commit.
- Application-code baseline: `0e690909af87ec3520aec95c718ed008b7525986` (`fix: prevent video imports from hanging on stalled seeks`).
- GitHub Actions run [#17](https://github.com/Inflare12/StudentNetwork/actions/runs/44237045304) completed successfully on that application-code commit. Its Production build job completed dependency installation, `npm test` and `npm run build`.
- Vercel preview for that same application-code commit reached READY: https://studentnetwork-lnxw2rt0f-inflare-s-projects.vercel.app
- The README was corrected on 19 November to describe the shipped local AI, file-import, privacy and model limitations accurately. The final documentation-only PR head still requires its own CI and preview confirmation before it can be called the exact release candidate.

### Build warnings observed in Vercel logs

These did not fail the build, but should not be hidden:
- Transformers.js chunk: 543.63 kB (156.66 kB gzip).
- PDF.js chunk: 409.05 kB (121.62 kB gzip).
- ONNX WASM asset: 26,861.77 kB (6,762.79 kB gzip).
- PDF worker: 1,232.30 kB (reported uncompressed).
- npm warned about an unknown `cache-dir` setting and install scripts for `onnxruntime-node`, `protobufjs` and `tesseract.js`.
- Rolldown warned that the `use client` module-level directive in lucide-react modules may not be preserved.

No evidence from this build proves that the model or OCR assets are downloaded during initial page load; actual browser network behaviour still needs inspection. The ONNX WASM asset is large enough to warrant real-device download and memory testing.

## Automated checks

- [x] GitHub Actions Node unit tests and production build pass on application-code baseline `0e690909` (run #17).
- [x] Automated media-event helper tests cover successful event, browser error and timeout paths on that baseline.
- [x] Vercel preview for the same application-code baseline reached READY.
- [ ] GitHub Actions and Vercel preview for the final 19 November documentation-only PR head are confirmed.
- [ ] No unresolved high-priority runtime errors; this requires interactive browser checks and cannot be inferred from build logs.

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
- [ ] Video sampling is tested with a short supported video; metadata and seek failures show a readable message rather than leaving the upload spinner running.
- [ ] Explain that video sampling does not transcribe audio.
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

- [x] On 19 November, feature scope was frozen; remaining work is verification and documentation only.
- [ ] Publish the exact final preview URL and commit SHA for the user's inspection after final-head CI and deployment complete.
- [ ] Do not describe the product as cleared for unrestricted public launch until core browser/device checks and adult/guardian privacy review are complete.
- [ ] Launch on 20 November only as a clearly described MVP if the responsible adult accepts the outstanding limitations and all required checks are completed.

## Current known limitations

- Profile and progress are browser-local; there are no accounts or cross-device sync.
- XP and mission completion are self-reported, not verified achievements.
- Opportunities are categories to investigate, not confirmed open registrations.
- File imports are capped at 25 MB to reduce memory pressure on phones.
- The local language model is small and may be slow or inaccurate; important answers must be checked.
- Image processing is OCR; video processing samples visible text and does not transcribe speech.
- No real ads or monetisation are enabled.
- Dependency versions are not fully pinned and no lockfile is committed; a future install can resolve different package versions.
- Model inference, OCR, offline behaviour, accessibility and core student flows still require real browser/device testing.
