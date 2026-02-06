# Specification

## Summary
**Goal:** Deliver a school-themed study helper chatbot with four subject modes, each with distinct tutoring patterns, plus per-user chat history persistence (via Internet Identity) and built-in static theme images.

**Planned changes:**
- Create a school-themed home screen with four mode choices (Math Help, Social Studies Help, Science Help, Language Arts Help) that transitions into a mode-specific chat view.
- Build a shared chatbot UI for all modes: message thread, text input, send via button/Enter, loading state, error state with retry, and clear conversation.
- Add a single Motoko canister `chat` update API that accepts (mode, message, optional context) and returns a mode-tailored text response with input validation and safe fallback replies.
- Implement unique response structures per mode (Math step-by-step, Social Studies timeline/causes-effects/key terms, Science hypothesis/evidence/conclusion + safety reminders, Language Arts thesis/outline/grammar + revision checklist).
- Add mode-specific quick prompt chips in the chat UI that insert helpful starter text into the input.
- Persist chat history per (Internet Identity principal, mode) in the backend; allow clearing stored history per mode; keep anonymous users’ history in-memory only.
- Apply a cohesive “school vibe” theme across home and chat screens and render generated static images from `frontend/public/assets/generated`.

**User-visible outcome:** Users can choose a subject mode, chat with a mode-specific study helper, switch modes without refreshing, see themed visuals, and (when signed in) return later to find each mode’s prior conversation restored.
