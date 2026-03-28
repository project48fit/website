# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server
npm run build     # Production build
npm run lint      # ESLint check
npm run start     # Start production server
```

No test suite exists. Lint is the primary static check.

**Pre-commit hook**: Blocks commits containing curly/smart quotes in TypeScript files (causes Vercel build failures). Always use straight quotes.

## Architecture

**Next.js Pages Router** — all routes are files in `src/pages/`. No App Router.

### Request flow for lead capture
`/apply` → `POST /api/apply` → Upstash rate limit check → Supabase insert → Resend coach notification → LinkedIn Conversion API → queued applicant confirmation email (10-min delay)

### Key patterns

**API routes** (`src/pages/api/`) are plain function handlers with method validation, then business logic. Admin endpoints check `x-admin-token` header against `ADMIN_API_TOKEN` env var.

**Page layout**: Every page wraps content in `<PageLayout>` (includes `<Navbar>` and `<Footer>`).

**Supabase client**: Always use `src/lib/supabaseAdmin.ts` (service role) for server-side DB access. Never import the anon key client in API routes.

**LinkedIn token storage**: Tokens live in Supabase `linkedin_tokens` table. `src/lib/linkedinPost.ts` handles auto-refresh (5-day buffer before expiry). Tokens are tied to Birk's personal profile.

**Parallel AI**: `src/lib/parallel.ts` wraps the Parallel Web SDK used for AI-powered email draft generation at `/admin/followup`.

### Design system
Dark theme — `brand.bg` (#050506) backgrounds, `brand.accent` (#F2EDE0) for primary accents, `brand.signal` (#F2503A) for alerts. Fonts: `font-display` (EngraversOldEnglish) for headings, `font-sans` (Inter) for body. All tokens in `tailwind.config.js`.

### Admin pages
- `/admin/followup` — generates follow-up email drafts via Parallel API (no auth UI, uses env token)
- `/admin/linkedin` — OAuth connection + post composer for Birk's LinkedIn

### Environment variables
See `MEMORY.md` or the README for the full list. Key ones: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_API_TOKEN`, `PARALLEL_API_KEY`.
