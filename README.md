# Goldbook

Private gold research desk for Salah & Rayane.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Env keys

Copy `.env.example` → `.env.local` and fill what you have:

| Key | Purpose |
|---|---|
| `AUTH_SECRET` | Session signing (required, 32+ chars) |
| `SALAH_PIN` / `RAYANE_PIN` | 4-digit login PINs |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini LLM (primary) |
| `GROQ_API_KEY` | Groq LLM (fallback) |
| `GEMINI_MODEL` / `GROQ_MODEL` | Optional model overrides |
| `TWELVEDATA_API_KEY` | XAUUSD prices (primary) |
| `POLYGON_API_KEY` | XAUUSD prices (backup / Massive) |
| `FRED_API_KEY` | Macro / yields |
| `FINNHUB_API_KEY` | News headlines |
| `NEWS_API_KEY` | News backup |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Durable storage on Vercel |

Typed helpers: `src/lib/env.ts`, `src/lib/desk-config.ts`.

Build plan: see [`PLAN.md`](./PLAN.md).

Repo: [github.com/saharawavestravel-ops/Goldbook](https://github.com/saharawavestravel-ops/Goldbook)
