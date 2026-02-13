# josh-bot

An interactive portfolio site built as a parody AI product page. A chatbot answers questions about my experience, skills, and opinions through selectable AI voice personalities, each prompt-engineered with a distinct tone over a shared knowledge base.

## Architecture

Responses are generated server-side via the Anthropic Claude API and streamed to the client in real time. The system prompt is composed from three layers:

1. **Knowledge base** — factual context about my career, skills, and background (maintained as a TypeScript module)
2. **Voice personality** — per-voice prompt that controls tone and style
3. **Persona context** — adjusts content emphasis based on the selected audience (recruiter, engineer, general)

Follow-up suggestions are extracted from LLM output to guide conversation contextually.

### Available Voices

| Voice | Personality |
|-------|------------|
| The Butler | Formal, dry, begrudgingly helpful |
| The Engineer | Blunt, direct, minimal embellishment |
| The Spokesperson | Corporate PR tone, buzzword-heavy |
| The Hype Man | Unreasonably enthusiastic |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit, Svelte 5 (runes API) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| LLM | Anthropic Claude API (streaming) |
| Rate Limiting | Upstash Redis — two-tier per-IP (10/min, 100/day) |
| Deployment | Vercel, serverless, Node 22.x runtime |

No database. All content is version-controlled TypeScript. Rate limiting is the only stateful component.

## Local Development

```bash
git clone https://github.com/hutfut/josh-bot.git
cd josh-bot
npm install
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Enables chat functionality |
| `UPSTASH_REDIS_REST_URL` | No | Production rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Production rate limiting |

Rate limiting falls back to an in-memory implementation when Upstash credentials are not provided.