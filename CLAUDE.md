# AI Shelf — Project Context

## What this is
Personal web app for curating AI learning resources (articles, videos) with search, filters, read state, ratings, and dark mode. Content lives in `/data/resources.json`. Read state and ratings are tracked via localStorage per-browser.

## Stack
- Next.js 16+ (App Router, TypeScript)
- Tailwind CSS v4
- Fuse.js (client-side full-text search)
- Vercel (hosting)

## Project location
`~/Documents/pets/ai-learning-hub/`

## Dev server
```bash
npm run dev   # uses --webpack (Turbopack incompatible with @custom-variant dark in dev)
```

## Content model
See `/types/resource.ts` for the `Resource` type.
See `/data/resources.json` for current content (18 resources).

Categories (fixed):
- AI Engineering & Education
- Claude Workflow & Skills
- AI Agents & Orchestration
- Curation & Discovery
- Tools & Stacks
- Other

Types: `article` | `video`

## localStorage keys
- `ai-hub-status` — `Record<string, 'unread' | 'in-progress' | 'read'>`
- `ai-hub-ratings` — `Record<string, number>` (1–5)
- `theme` — `'dark' | 'light'`

All storage utilities live in `lib/storage.ts`.

## Key decisions
- No DB: content in JSON, redeploy on content change
- No auth: personal-use app, localStorage for state
- Fuse.js over server search: dataset < 500 items
- localStorage over cookies: no 4KB limit, no request pollution
- `next dev --webpack`: Turbopack ignores `@custom-variant dark` in dev mode
- Sort order fixed at page load to avoid visual jumps when toggling read state

## Architecture
- `app/page.tsx` — Server Component, passes data to ResourceList
- `app/[id]/page.tsx` — Server Component, detail page with takeaways + StarRating
- `components/ResourceList.tsx` — Client Component: search, filters, sort, StatsBar
- `components/ResourceCard.tsx` — card with ReadToggle + StarRating + book icon
- `components/ReadToggle.tsx` — 3-state: unread → reading → read
- `components/StarRating.tsx` — 1–5 stars, localStorage-persisted
- `components/StatsBar.tsx` — read/reading/unread counts + progress bar
- `components/ThemeToggle.tsx` — dark/light toggle, persisted to localStorage
- `lib/storage.ts` — shared localStorage utilities + migration from old format

## Phases
- **Phase 0** ✅ Scaffolding
- **Phase 1** ✅ Core UI — search, filters, `/[id]` page, read state
- **Phase 2** ✅ Content population — 18 resources imported from Obsidian
- **Phase 3** ✅ Polish — dark mode, stats, 3-state read, ratings, filters, sorting, AI Shelf branding
- **Phase 4** ⬜ Auth + Backend — see TODO

## TODO

### Auth
- [ ] Gmail / Google OAuth — allow personal login to sync state across devices
- [ ] Protect write operations behind auth

### Backend
- [ ] Replace localStorage with a real backend (Supabase or similar)
- [ ] Persist read status, ratings, and progress server-side per user
- [ ] Keep localStorage as offline/unauthenticated fallback
