# Project Email Templates

## Purpose
Write or edit email copy that aligns with Project Fitness voice and drives the next step in the funnel. All email copy must match the executive coaching brand -- calm, direct, credible, and action-oriented.

## Email Types in the System
1. Coach notification (immediate) -- plain text, sent to COACH_NOTIFY_EMAILS when a lead submits
2. Applicant confirmation (10-min delayed) -- HTML + plain text, sent to applicant with booking link
3. Newsletter (ongoing) -- sent to Resend audience for nurture
4. Stale lead alert (daily) -- plain text, sent to coaches listing leads who have not booked
5. Weekly pipeline report -- plain text, sent to coaches with metrics

## Brand Voice for Email
- Direct and confident, not warm and fluffy
- Action-oriented: every email has one clear next step
- Executive tone: respects the reader's time, no filler
- No hype, no scarcity, no consumer fitness language
- Sign off: Birk & Caleb, Founders of Project Fitness, projectfitness.co

## Inputs
- Email type (coach notification, applicant confirmation, newsletter, report, alert)
- Recipient context (coach, applicant, subscriber)
- Required CTA and any links
- Specific constraints or information to include

## Outputs
- Subject line (under 60 characters)
- Plain text body
- HTML body (for applicant-facing emails)

## Procedure
1) Identify email type and recipient from the Inputs.
2) Write a subject line under 60 characters that signals exactly what the email contains or requires.
3) Open with one sentence of direct context -- no lengthy preamble.
4) State the required action or information in plain terms.
5) Use short bullets if listing multiple items (max 4).
6) End with a single clear CTA (link or action).
7) Sign off: "Birk & Caleb / Founders of Project Fitness / projectfitness.co"
8) For HTML emails: keep structure simple -- header logo, body text, CTA button, footer.

## Hard Rules
- Never use scarcity language ("spots are limited", "last chance", "act now")
- Never use hype language ("revolutionary", "unlock", "transform")
- Never write long paragraphs -- max 3 sentences per block
- Subject lines must be specific -- no "Check this out" or "Quick update"
- Booking link: process.env.BOOKING_URL (Google Calendar link)
- From address: process.env.APPLY_EMAIL_FROM or process.env.APPLY_CONFIRMATION_FROM

## Subject Line Patterns
- Applicant confirmation: "Thanks for applying -- book your call"
- Coach notification: "New coaching application -- {name}"
- Stale lead alert: "Action needed: {n} lead(s) haven't booked yet"
- Weekly report: "Project Fitness -- Weekly Pipeline Report ({date})"
- Newsletter: topic-specific, under 60 chars

## Failure Modes
- Scarcity or urgency language in any email
- Subject lines that are vague or clickbait-style
- Long paragraphs without a clear next step
- Missing booking link in applicant-facing emails
- Sign-off missing or wrong

## Examples
Good:
- Subject: "Thanks for applying. Book your coaching call"
- Body: "The next step is to book your 15-20 minute call. We'll cover your goals, training history, and whether Project is the right fit."
- CTA: "Book your coaching call" [link]

Bad:
- Subject: "Last chance to lock in your spot"
- Body: "We are thrilled to have you join our community of high-performers ready to unlock their full potential."
