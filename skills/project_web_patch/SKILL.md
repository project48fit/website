# Project Web Patch

## Purpose
Apply small, targeted edits to website source files while protecting brand, pricing integrity, and conversion flow. Always use targeted edits -- never rewrite full files.

## Site Structure (current)
- `/` -- Home page: Hero component only. CTAs link to /apply.
- `/apply` -- Primary conversion page: left panel (copy) + right panel (form).
- `/about` -- About page: Approach cards + team section.
- `/coaching` -- Pricing page: Advisory ($250/mo) + Elite ($500/mo) cards.
- `/resources` -- Resources page: Newsletter signup + PDF download.
- `/privacy`, `/terms` -- Legal pages. Do not edit.
- `/api/*` -- API routes. Do not edit.

## Component File Map
- Hero: `src/components/Hero.tsx`
- About section: `src/components/About.tsx`
- Coaching/Pricing: `src/components/Coaching.tsx`
- Resources: `src/components/Resources.tsx`
- Navbar: `src/components/Navbar.tsx`
- Footer: `src/components/Footer.tsx`
- Apply page: `src/pages/apply.tsx`
- About page: `src/pages/about.tsx`
- Coaching page: `src/pages/coaching.tsx`

## Inputs
- Target page or component name
- Specific text or section to change
- Context for why the change is needed

## Outputs
- Targeted edit for each change (old string -> new string, file path)
- List of files modified and what changed

## Procedure
1) Identify the correct source file using the Component File Map above.
2) Read the current file content before making any edits.
3) Make minimal, targeted edits -- change only what is specified.
4) Keep copy concise and executive-focused.
5) Confirm pricing remains $250/month (Advisory) and $500/month (Elite) after edits.
6) Use straight ASCII single quotes in TS/TSX string literals -- never curly/smart quotes.
7) Run `npm run build` in the project root to verify no TypeScript errors after editing.
8) Summarize what changed and in which file.

## Hard Rules
- Never edit API routes (`src/pages/api/`) or environment variable usage.
- Never change routing structure, layout, or component imports unless explicitly requested.
- Never add scarcity, urgency, hype, or consumer fitness language.
- Never change pricing to anything other than $250/month Advisory or $500/month Elite.
- Never use curly/smart quotes (' ' " ") in TS/TSX string literals.
- Always use targeted Edit calls -- never rewrite entire files.

## Examples
Good edit:
- Target: Hero eyebrow text
- File: src/components/Hero.tsx
- Change: "Executive Fitness Coaching" -> "Executive Health & Performance"

Bad edits:
- Rewriting an entire component file to make one copy change
- Editing src/pages/api/apply.ts
- Adding "Limited spots available" anywhere
- Using curly quotes inside a JS string literal
