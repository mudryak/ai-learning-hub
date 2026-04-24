<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Learning Hub — Agent Roster

## Project
Public web app for curating AI learning resources (articles, videos) with tags, categories, and read-state tracking via localStorage. Content stored in `/data/resources.json`. No database, no auth. Deployed on Vercel.

Tech stack: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Fuse.js.

## Agents

### @project-manager
**Role:** Orchestrator. Single entry point for all project tasks.
**Responsibilities:** Decompose tasks, route to the right agents in the right order, verify artifacts, update this file.
**How to invoke:** Describe a task in natural language — PM decides who handles it.

### @architect
**Role:** Technical architecture and structure decisions.
**Responsibilities:** Component tree design, data model, ADR, review structural proposals from other agents.
**Artifacts:** ADR files, component structure docs
**Authority:** Architecture decisions are final. Other agents must get @architect approval before deviating from the established structure.

### @frontend-engineer
**Role:** UI implementation.
**Responsibilities:** Pages, components, search (Fuse.js), filters, localStorage read-state, responsive layout.
**Scope:** `/app/`, `/components/`

### @hub-content
**Role:** Content ingestion.
**Responsibilities:** Add new resources to `/data/resources.json`. Fetch OG metadata from URL, suggest category/tags, prompt for takeaways, append entry.
**How to invoke:** `@hub-content <url>`

### @reviewer
**Role:** Code review + QA.
**Responsibilities:** Review code before merge, run tsc + eslint, check edge cases, verify alignment with architecture.

### @devops
**Role:** Infrastructure and deployment.
**Responsibilities:** Vercel config, GitHub Actions CI, environment variables, initial deploy.
**Artifacts:** `vercel.json`, `.github/workflows/`

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-24 | No database — content in JSON files | MVP simplicity; redeploy on content change is acceptable |
| 2026-04-24 | No auth — public hub | Single user, read state via localStorage |
| 2026-04-24 | Fuse.js for search | Dataset < 500 items, client-side is sufficient |
| 2026-04-24 | localStorage over cookies | Cookies have 4KB limit and pollute request headers |
| 2026-04-24 | 6 fixed categories | Derived from existing Obsidian AI Learning Map |
| 2026-04-24 | ReadToggle uses lazy useState initializer | Avoids setState-in-effect ESLint error; localStorage read happens once on mount |
| 2026-04-24 | ResourceList is a Client Component, page.tsx stays Server Component | Data is passed as props; only the interactive layer ships client JS |

## Current Phase

**Phase 0 — Scaffolding** ✅
- [x] Next.js project created
- [x] TypeScript + Tailwind configured
- [x] `/data/resources.json` with 3 test entries
- [x] `/types/resource.ts` defined
- [x] AGENTS.md initialized

**Phase 1 — Core UI** ✅
- [x] Fuse.js installed and wired to `ResourceList` (search across title, description, tags)
- [x] Filters by category (6 fixed values) and type (article | video) with clear button
- [x] `/[id]` detail page with full takeaways list and "Open resource" link
- [x] Read state via localStorage — toggle on card and detail page, persisted per browser
- [x] `components/ResourceList.tsx` — Client Component (search + filters)
- [x] `components/ResourceCard.tsx` — card with title link, tags, read toggle
- [x] `components/ReadToggle.tsx` — Client Component, lazy-init from localStorage
- [x] `app/[id]/page.tsx` — Server Component, `params` awaited per Next.js 16 API
- [x] tsc --noEmit: no errors
- [x] eslint: no errors

**Phase 2 — Content Population** ✅
- [x] Imported 17 resources from Obsidian AI Learning vault
- [x] 8 skipped: no public URL (local/Slack sources) or off-topic (crypto, career, no content retrieved)
- [x] Existing 3 test entries corrected: URLs updated from Obsidian source, descriptions and takeaways rewritten
- [x] Categories covered: AI Engineering & Education (6), Claude Workflow & Skills (7), AI Agents & Orchestration (2), Tools & Stacks (1), Curation & Discovery (1)
- [x] tsc --noEmit: no errors

**Phase 3 — Polish + Demo Prep** ⬜ Next
