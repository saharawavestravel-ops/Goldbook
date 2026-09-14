# Goldbook — Build Plan

**Product:** Private gold research desk for Salah & Rayane  
**Goal:** Empty folder → production-ready web app  
**How we work:** You say `next` → one task is finished → repeat until done.

When every task below is ✅ and you say `next` again → no more edits. Message only: plan finished, project ready for production.

---

## Status

| Field | Value |
|---|---|
| Phase | E — Production |
| Next task | **Done** |
| Progress | `24 / 24` |

---

## Phase A — Foundation

- [x] **T01** Scaffold Next.js app (App Router, TypeScript, Tailwind) named **Goldbook**
- [x] **T02** Design system: colors, typography, spacing, motion tokens (Apple/Airbnb calm — not a trading terminal)
- [x] **T03** App shell: layout, 4-tab nav (`Today` · `Agents` · `History` · `You`), empty route frames
- [x] **T04** Auth: Salah & Rayane profiles + PIN login + session (private 2-user desk)
- [x] **T05** User profile page (`You`): avatar, name, change PIN, sign out

## Phase B — Product UI

- [x] **T06** Home / Today: live price zone, bias hero, confidence, levels, agent avatar row, primary CTAs
- [x] **T07** Agents roster: 6 agent cards (Aurelia, Marcus, Nova, Iris, Felix, Vera) with name, avatar, role, one-liner
- [x] **T08** Agent profile page: bio, watches, status, today’s take, sources area
- [x] **T09** Daily Brief page: bias, confidence, why, debate, plan, sources, share/save actions
- [x] **T10** Desk Run live UI: agent timeline while the desk works → brief ready
- [x] **T11** History page: past briefs list with hit/miss badges + open past brief

## Phase C — Brain & real data

- [x] **T12** Env + config: `.env.example` for Groq (free LLM), FRED, market data, news keys
- [x] **T13** Market data layer: XAUUSD (+ DXY/yields helpers) with real API adapters + safe fallbacks
- [x] **T14** News + macro layer: headlines filter + FRED/macro features for agents
- [x] **T15** Agent engine: specialist missions → structured scores (−1…+1) + confidence + sources
- [x] **T16** Chief fusion (Aurelia): weighted vote, Vera veto, daily bias + levels + confidence
- [x] **T17** Wire **Run desk** → live UI → persist Daily Brief for today

## Phase D — Learning & polish

- [x] **T18** Scorekeeper: grade yesterday’s call vs real price; update history hit/miss
- [x] **T19** Motion + UX polish: login lift, confidence count-up, desk-run sequence, page fades
- [x] **T20** Mobile + desktop pass: phone-first layout, desktop breathing room
- [x] **T21** Empty/error/loading states + research disclaimer (not financial advice)

## Phase E — Production

- [x] **T22** Persistence: store users, briefs, scores (DB or durable file store ready for deploy)
- [x] **T23** Production hardening: security headers, PIN hashing, rate limits on run, env validation
- [x] **T24** Deploy to Vercel + smoke check (login → run desk → brief → history) → mark production-ready

---

## Locked product decisions

| Item | Decision |
|---|---|
| Name | **Goldbook** |
| Users | Salah, Rayane — login + PIN |
| Scope | Full day (Asia → London → NY) |
| Output | Web app, minimal smooth UX |
| LLM | Free first (Groq, Gemini fallback optional) |
| Trading | Research desk only — **no auto-trade** in v1 |
| Agents | Aurelia (chief), Marcus, Nova, Iris, Felix, Vera |

---

## Rules for `next`

1. Do **only the next unchecked task** (T01 → T24 in order).
2. Mark it done in this file when finished.
3. Update **Status** (`Next task`, `Progress`).
4. After **T24** is done, if you say `next` again: **no edits** — only confirm production-ready.
