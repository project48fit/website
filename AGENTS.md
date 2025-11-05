# Repository Guidelines

## Repository Structure & Module Organization
- `src/pages/` holds the Next.js Pages Router entry points; shared layout and styles live in `src/pages/_app.tsx`.
- `src/components/` contains reusable React components (navbar, hero, coaching sections, forms).
- `src/styles/` stores Tailwind-powered global and theme utility layers.
- `public/` exposes static assets: images in `public/assets/images/`, videos in `public/assets/videos/`, fonts under `public/fonts/`, and `public/favicon.png`.
- `design/` captures design references (`wireframe_notes.md`) for quick handoff context.

## Build, Test, and Development Commands
- `npm install` — install dependencies and generate `package-lock.json`.
- `npm run dev` — start the Next.js dev server on port 3000.
- `npm run build` — create a production build; run this before committing to catch type errors.
- `npm run start` — serve the production build locally for smoke tests.

## Coding Style & Naming Conventions
- TypeScript + React with functional components; prefer named exports per file.
- Tailwind CSS drives styling. Compose utility classes in JSX; add shared patterns to `src/styles/theme.css`.
- Maintain 2-space indentation and single quotes in TSX/TS files; keep lines under ~100 characters.
- Assets use kebab-case filenames (e.g., `team_birk.JPEG`).

## Testing Guidelines
- Automated tests are not yet configured. When adding tooling, place tests in `src/__tests__/` mirroring component paths and name files `*.test.ts(x)`.
- For manual QA, run `npm run build` and exercise critical routes (`/`, `/about`, `/coaching`, `/resources`, `/apply`).

## Commit & Pull Request Guidelines
- Use conventional, descriptive commit subjects (e.g., `feat: add hero stats module`, `fix: update navbar CTA color`).
- Each PR should summarize scope, list key changes, and note any manual testing performed. Attach screenshots or recordings for UI updates and reference related issues.
- Ensure `npm run build` passes before opening a PR; address linter or type warnings proactively.

## Agent-Specific Tips
- Favor `apply_patch` for single-file edits to keep diffs focused.
- When swapping imagery, update both component references and corresponding files in `public/assets/images/`.
- After dependency changes, rerun `npm install` so `package-lock.json` stays in sync.
