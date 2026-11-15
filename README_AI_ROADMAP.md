# StudentNetwork — learning studio implementation notes

## Implemented in this phase
- Dedicated AI Study Studio route in the existing React app.
- Browser-side material extraction for PDF, DOCX, text/Markdown/subtitle files, images (OCR), and sampled video frames (OCR).
- Optional local text-generation model through Transformers.js using the quantized onnx-community SmolLM2 135M Instruct ONNX model (q4 weights are approximately 182 MB).
- Deterministic offline coach fallback when the model is not downloaded or cannot run.
- Study modes: teach, explain simply, homework coach, quiz prompts, answer self-assessment and summarise.
- Files are processed in the browser; this feature does not upload them to a StudentNetwork backend.

## Important limitations
- Local model quality, speed, memory use and browser compatibility vary. The model must be downloaded to the student's device and the first download needs internet. There is no per-request AI provider bill, but bandwidth and hosting are not universally free.
- The small language model is not a frontier model and can hallucinate. Students should verify important answers.
- Image understanding in this phase is OCR (text extraction), not full visual reasoning.
- Video support samples four frames for visible text. It does not transcribe speech or understand all scenes. Upload a VTT or SRT subtitle/transcript file for text-based video context.
- The local fallback is rule-based and must never be described as generative AI.
- No accounts, cross-device sync, shared leaderboards or public messaging are introduced in this phase.

## Next engineering phases
1. Add privacy-reviewed backend schema, authentication/consent flows and RLS before shared student data.
2. Add real-time challenge rooms and anti-abuse controls; do not treat self-reported XP as verified achievement.
3. Improve content ingestion: image vision, video transcription, OCR languages, larger PDFs and syllabus chapter mapping.
4. Add assessment rubrics, spaced repetition and progress analytics with teacher/parent controls.
5. Add advertising only after legal/policy review and adult account ownership where required. Avoid personalised tracking for children.

## Ads and account eligibility
AdSense publisher accounts require the publisher to be at least 18. A parent or guardian may apply with their own Google Account, and payments go to that adult. Review current policies before adding ad code. See Google's current publisher age requirements and child/teen ad protections.
