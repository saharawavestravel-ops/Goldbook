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

### Env keys (T12)

Copy `.env.example` → `.env.local` and fill what you have:

| Key | Purpose |
|---|---|
| `AUTH_SECRET` | Session signing (required) |
| `SALAH_PIN` / `RAYANE_PIN` | 4-digit login PINs |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Free Gemini LLM (primary) |
| `GROQ_API_KEY` | Free Groq LLM (fallback) |
| `TWELVEDATA_API_KEY` | XAUUSD prices (T13) |
| `FRED_API_KEY` | Macro / yields (T14) |
| `FINNHUB_API_KEY` | News (T14) |

Typed helpers: `src/lib/env.ts`, `src/lib/desk-config.ts`.

Build plan: see [`PLAN.md`](./PLAN.md).
