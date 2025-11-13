# project. Website (Next.js + Tailwind)
Run locally:
1. npm install
2. npm run dev
Assets live in `/public/assets`. Font loads via `/public/fonts/engravers-old-english.ttf`.

## Environment Variables
Copy `.env.local.example` to `.env.local` and set:
- `RESEND_API_KEY` – API key from Resend (optional; if omitted, submissions log to server output)
- `APPLY_EMAIL_FROM` – Verified sender (e.g., `Project. Coaching <apply@notifications.projectfitness.co>`)
- `APPLY_EMAIL_TO` – Destination email for application notifications
- `RESEND_NEWSLETTER_AUDIENCE_ID` – Audience ID in Resend where newsletter signups are stored
- `NEWSLETTER_EMAIL_FROM` – Sender address for newsletter opt-in notifications
- `NEWSLETTER_EMAIL_TO` – Inbox that should receive newsletter sign-ups (defaults to `APPLY_EMAIL_TO` if omitted)
- `NEWSLETTER_EMAIL_SUBJECT` – Optional custom subject line for newsletter alerts
- `OPENAI_API_KEY` – Enables the AI intake assistant and newsletter draft generator
