---
name: Supabase Patterns
description: Decisions and patterns for Supabase usage in this project — auth, RLS, data fetching
type: technical
---

## Two clients — never mix them
- `lib/supabase/server.ts` — for Server Components and Route Handlers (reads cookies)
- `lib/supabase/client.ts` — for Client Components (browser session)
Using the server client in a Client Component (or vice versa) breaks auth.

## user_progress upsert pattern
Always use upsert with explicit conflict resolution:
```ts
await supabase.from('user_progress').upsert(
  { user_id: user.id, resource_id, status, updated_at: new Date().toISOString() },
  { onConflict: 'user_id,resource_id' }
)
```
PK is `(user_id, resource_id)` — insert without onConflict will error on duplicate.

## Progress loaded in one query, not per-component
AppContext loads ALL user_progress for the current user in a single query on mount.
Components read from context — they do NOT make individual Supabase calls for their own status/rating.
This avoids N+1 queries (one per card).

## Supabase Redirect URLs
Both prod and local must be in the allowed list:
- `https://ai-learning-hub-tan.vercel.app/**`
- `http://localhost:3000/**`

Site URL = prod URL. Add localhost only to Redirect URLs, not Site URL.

## RLS — users can read all resources, write only own progress
```sql
-- resources: public read
create policy "resources_public_read" on resources for select using (true);

-- user_progress: own rows only
create policy "progress_select" on user_progress for select using (auth.uid() = user_id);
create policy "progress_insert" on user_progress for insert with check (auth.uid() = user_id);
create policy "progress_update" on user_progress for update using (auth.uid() = user_id);
```
