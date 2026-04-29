---
name: Next.js 16 Gotchas
description: Breaking changes and non-obvious behavior in Next.js 16 that caused real bugs in this project
type: technical
---

## proxy.ts instead of middleware.ts
Next.js 16 renamed `middleware.ts` → `proxy.ts`. The exported function must also be named `proxy`, not `middleware`.
```ts
export async function proxy(request: NextRequest) { ... }
```
Using `middleware.ts` still works but logs a deprecation warning on every request.

## params must be awaited
In App Router dynamic routes, `params` is now a `Promise`:
```ts
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```
Using `params.id` directly (without await) throws a runtime error.

## Turbopack breaks dark mode in dev
`next dev` (Turbopack) does not process `@custom-variant dark (&:is(.dark *))` from Tailwind v4 — falls back to `@media (prefers-color-scheme: dark)`, breaking class-based dark mode toggle.
Fix: `next dev --webpack` in package.json dev script. Production Turbopack build works correctly.

## React 19 ignores raw script tags
`<script dangerouslySetInnerHTML>` inside JSX components is silently ignored in React 19.
Fix: use `<Script strategy="beforeInteractive">` from `next/script`.

## Hydration mismatch with localStorage
`useState(() => localStorage.getItem(...))` runs on SSR (returns null) and again on client hydration (returns real value) → mismatch.
Fix: always `useState(false)` + `useEffect` to read localStorage after mount.
