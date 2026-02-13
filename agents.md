# Agent instructions

**Project:** SvelteKit app (Svelte 5 runes, TypeScript, Tailwind v4). Interactive portfolio with a chatbot: server-streamed responses via Anthropic, multiple voice personalities, server-side sessions, and layered prompt-injection defenses. See README for full architecture and env vars.

---

## Structure

- **`src/routes/`** – Pages and API. Chat UI is `chat/+page.svelte`; the only chat endpoint is `api/chat/+server.ts`.
- **`src/lib/server/`** – Server-only: prompts, context builder, sanitize, sessions, ratelimit. Never import these from client code (SvelteKit will error).
- **`src/lib/`** (non-server) – Shared types, components, and client-safe logic. Chat state and stream consumption live in `lib/chat/`.
- **`src/lib/components/VoiceCards.svelte`** – Initial voice selection as a 2x2/4-col card grid (shown pre-conversation).
- **`src/lib/components/VoiceBar.svelte`** – Compact sticky voice pill bar (shown during active conversation).
- **`src/lib/analytics.ts`** – Client-only PostHog wrapper (`initPostHog`, `track`). Must not be imported from `src/lib/server/`.
- **`src/lib/data/`** – Static content: voice definitions, greetings, fallbacks, changelog. Add copy or new voices here; prompt text and personality live in `lib/server/prompts.ts`.

---

## Patterns

- **Svelte 5:** Use runes (`$state`, `$derived`, `$effect`) everywhere. No legacy stores or lifecycle hooks for new code.
- **Chat flow:** Client sends `{ message, voiceId, sessionId?, persona? }` to POST `/api/chat`. History is stored server-side; the client never sends conversation history. Responses stream back; follow-up pills are parsed from `[FOLLOWUPS]` blocks in the LLM output.
- **Voice switching:** Voice can be switched mid-conversation without reset. The per-request `voiceId` is used for prompt generation, not the session's stored value. Each assistant message records the `voiceName` that generated it.
- **Types:** Shared types in `$lib/types` (e.g. `Persona`, `ResponseSource`, `ChatMessage`, `ActionPill`). Use these instead of ad-hoc shapes.
- **API responses:** Chat API returns `{ response: string, source: ResponseSource }` (and sometimes `followUps`). Error/rate-limit responses use the same shape with a human-readable `response` and appropriate `source`.
- **Analytics:** All events go through the `track()` wrapper in `lib/analytics.ts`. Do not call `posthog` directly from components.

---

## Security (do not weaken)

- **Input:** All user message content goes through `sanitizeInput`; do not bypass or relax it. `voiceId` and `persona` are validated against allowlists (`VALID_VOICE_IDS`, `VALID_PERSONAS`); keep allowlists in sync with `lib/data/` and types.
- **Output:** Streamed LLM output is checked with `checkOutputForLeaks`. Do not stream unfiltered model output to the client.
- **Sessions:** Session state and history live only on the server. Do not add client-sent conversation history to the request body or trust client-provided message lists.
- **Secrets:** `ANTHROPIC_API_KEY` and Upstash credentials are in `$env/dynamic/private` only. Never expose them to the client bundle.

---

## Conventions

- **Naming:** `voiceId` (camelCase) for the selected voice; `sessionId` for the server-issued session token. Personas use the `Persona` type.
- **Errors:** User-facing error and rate-limit messages are intentional copy (witty tone). Keep that tone when changing them; avoid generic "Something went wrong" unless it’s a true fallback.
- **New features:** If adding a new voice or persona, update both the data layer (`lib/data/` or server prompts) and the allowlists in `lib/server/prompts.ts`.

---

## Style

- **No em dashes (—, U+2014)** in copy, comments, or docs. Use colons, commas, semicolons, or rephrasing. En dashes (–) in ranges (e.g. 2020–2024) are fine.

---

## Reference

- **README.md** – Stack, env vars, rate limits, and security layers.
- **`src/lib/server/prompts.ts`** – System prompt assembly, voice personalities, sandwich defense, and allowlists.
