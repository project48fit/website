# project. Website (Next.js + Tailwind)
Run locally:
1. npm install
2. npm run dev
Assets live in `/public/assets`. Font loads via `/public/fonts/engravers-old-english.ttf`.

## Admin Tools
### Follow-up Draft Generator
Visit `/admin/followup` to generate and edit a follow-up email draft using Parallel.
- If `ADMIN_API_TOKEN` is set, enter it in the form (it will be sent as the `x-admin-token` header).
- Requires `PARALLEL_API_KEY` to be configured.

## Environment Variables
Copy `.env.local.example` to `.env.local` and set:
- `RESEND_API_KEY` – API key from Resend (optional; if omitted, submissions log to server output)
- `APPLY_EMAIL_FROM` – Verified sender (e.g., `Project. Coaching <apply@notifications.projectfitness.co>`)
- `APPLY_EMAIL_TO` – Destination email for application notifications
- `APPLY_CONFIRMATION_FROM` – Sender address for applicant confirmation emails (sent ~10 minutes after apply)
- `RESEND_NEWSLETTER_AUDIENCE_ID` – Audience ID in Resend where newsletter signups are stored
- `NEWSLETTER_EMAIL_FROM` – Sender address for newsletter opt-in notifications
- `NEWSLETTER_EMAIL_TO` – Inbox that should receive newsletter sign-ups (defaults to `APPLY_EMAIL_TO` if omitted)
- `NEWSLETTER_EMAIL_SUBJECT` – Optional custom subject line for newsletter alerts
- `PARALLEL_API_KEY` – Parallel API key for agent-assisted coach briefs (optional)
- `PARALLEL_PROCESSOR` – Processor name for Parallel runs (defaults to `base`)
- `ADMIN_API_TOKEN` – Shared secret required by admin helper endpoints (optional but recommended)
