@AGENTS.md

# AI Learning Hub — Project Context

## What this is
A public web app for curating AI learning resources (articles, videos). No database, no auth. Content lives in `/data/resources.json`. Read state is tracked via localStorage per-browser.

## Stack
- Next.js 16+ (App Router, TypeScript)
- Tailwind CSS
- Fuse.js (client-side full-text search)
- Vercel (hosting)

## Project location
`~/Documents/pets/ai-learning-hub/`

## Content model
See `/types/resource.ts` for the `Resource` type.
See `/data/resources.json` for current content.

Categories are fixed (defined in `ResourceCategory` type):
- AI Engineering & Education
- Claude Workflow & Skills
- AI Agents & Orchestration
- Curation & Discovery
- Tools & Stacks
- Other

Types: `article` | `video`

## Current state
Check `AGENTS.md` → "Current Phase" section for where we are in the roadmap.

## How to work on this project

**Always route tasks through @project-manager.** Example:
```
@project-manager Добавь страницу /[id] с полными takeaways и кнопкой "mark as read"
```

**To add a resource:**
```
@hub-content https://...
```

**Agent responsibilities** are defined in `AGENTS.md`. Before making changes:
1. Check which agent owns the area
2. If the change touches architecture — check `AGENTS.md` Decision Log first
3. After completing a phase — update `AGENTS.md` Current Phase section

## Key decisions (summary)
- No DB: content in JSON, redeploy updates content
- No auth: public read, localStorage for personal read-state
- No AI features in MVP
- Fuse.js over server search: dataset < 500 items
- localStorage over cookies: no 4KB limit, no request pollution

## Phases
- **Phase 0** ✅ Scaffolding — done
- **Phase 1** 🔄 Core UI — search, filters, `/[id]` page, read state
- **Phase 2** ⬜ Content population — @hub-content agent, import from Obsidian
- **Phase 3** ⬜ Polish + demo prep
