# AI Shelf

Personal web app for curating AI learning resources — articles and videos with search, filters, read state tracking, and personal ratings.

## Features

- Full-text search across title, description, and tags (Fuse.js)
- Filter by category, type, read status, and minimum rating
- 3-state read tracking: Unread → Reading → Read
- 5-star personal ratings
- Reading progress bar (read / reading / unread counts)
- Dark / light theme with no flash on load
- Auto-sort: Reading first, Read last
- Detail page with full takeaways for each resource

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Fuse.js
- Vercel (hosting)

## Content

Resources live in `/data/resources.json`. Read state and ratings are stored in localStorage per browser.

To add a resource — add an entry to `data/resources.json` following the `Resource` type in `types/resource.ts`.

## Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
