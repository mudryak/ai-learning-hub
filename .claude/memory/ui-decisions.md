---
name: UI Decisions
description: Design and UX decisions made during development — what was tried, what was chosen and why
type: design
---

## Sort order snapshotted at page load
Sorting by read status (reading → unread → read) is fixed at the moment the page loads.
When a user toggles a card's status, the card does NOT immediately jump to a new position.
Reason: live re-sorting caused jarring visual jumps.
Implementation: `sortProgress` state is set once when `progressLoaded` becomes true, never updated after.

## Auth prompt — inline popover, not redirect
When an unauthenticated user clicks ReadToggle or StarRating, we show a small inline popover:
"Sign in to track progress" + "Sign in →" link + "Later" dismiss button.
Reason: hard redirect on a click is jarring UX. User can dismiss and keep browsing.

## Open → navigates to detail page, not external URL
The "Open →" button on cards goes to `/[id]` (detail page), not directly to the external URL.
External URL is accessible from the detail page via "Open resource →".
Reason: encourage users to read takeaways before opening the original.

## ReadToggle: 3 states, not binary
Cycle: unread → in-progress (amber) → read (emerald) → unread
Reason: "currently reading" is a meaningful state for a reading tracker.

## FOUC fix: CSS media query fallback
Added to globals.css:
```css
@media (prefers-color-scheme: dark) { html { background: #0a0a0a; } }
```
This prevents white flash for dark-system users before JS runs.
The JS theme script (`proxy.ts` → beforeInteractive) handles the full theme logic.

## StatsBar shows loading skeleton
While `progressLoaded` is false, StatsBar shows a pulse skeleton instead of 0/0/17.
Reason: showing 0 read before data loads is confusing.
