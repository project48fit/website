# project. Website (Next.js + Tailwind)
Run locally:
1. npm install
2. npm run dev
Assets live in `/public/assets`. Font loads via `/public/fonts/engravers-old-english.ttf`.

## Environment Variables
Copy `.env.local.example` to `.env.local` and set:
- `RESEND_API_KEY` – API key from Resend (optional; if omitted, applications log to server output)
- `APPLY_EMAIL_TO` – Destination email for application notifications
