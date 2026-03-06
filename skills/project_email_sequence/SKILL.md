# Project Email Sequence

## Purpose
Design and write post-application email sequences for leads who have not booked a consultation call. The goal is to move them from "applied" to "booked" without pressure tactics. Each email in the sequence must be independently useful -- not dependent on the previous email being read.

## Sequence Context
After a lead submits the application form, they receive an immediate confirmation email with the booking link (sent by the system via Resend). If they do not click the booking link within 24 hours, they become a stale lead. This skill handles the follow-up sequence after the initial confirmation.

## Sequence Structure

### Email 1 -- Follow-up (24-48 hours after apply, no booking)
- Subject: Short and direct, references their application
- Purpose: Re-surface the booking link, no pressure
- Tone: Matter-of-fact, not pleading
- Length: 4-6 sentences max

### Email 2 -- Value add (3-5 days after apply, no booking)
- Subject: Provides insight or useful content
- Purpose: Demonstrate credibility, stay top of mind
- Tone: Helpful and specific
- Length: Short article excerpt or 3-4 bullet framework
- CTA: Soft -- "If you are ready to move forward, book your call here."

### Email 3 -- Close or move on (7-10 days after apply, no booking)
- Subject: Direct -- asks if they are still interested
- Purpose: Get a yes or a no, clean up the pipeline
- Tone: Respectful, no guilt, businesslike
- Length: 3-4 sentences
- CTA: "If coaching is still on your radar, book here. If not, no worries."

## Inputs
- Lead name and primary goal (from Supabase)
- Number of days since application
- Whether they have opened any previous emails (if available)
- Booking URL

## Outputs
- Full email (subject + plain text body) for the appropriate sequence step
- Optional HTML version for emails 1 and 3

## Procedure
1) Determine which sequence step based on days since application and booking status.
2) Personalize with first name and primary goal where possible.
3) Write subject line under 60 characters.
4) Write body following the tone and length guidelines for that step.
5) Include booking link as plain text and as a CTA.
6) Sign off: "Birk & Caleb / Founders of Project Fitness"

## Hard Rules
- No scarcity language in any sequence email ("only 2 spots left", "last chance")
- No guilt or pressure ("we were expecting to hear from you")
- Each email must stand alone -- assume they did not read the previous one
- Maximum 3 emails in the sequence -- do not spam
- After email 3 with no response, mark lead as inactive and stop outreach

## Tone Calibration
- Email 1: Professional re-engagement
- Email 2: Useful, credible, zero sell
- Email 3: Clean close, respectful exit

## Examples

Email 1 subject: "Re: Your Project coaching application"
Email 1 body:
"Hey {first name}, just following up on your application from {date}. The next step is a quick 15-20 minute call to go over your goals and whether Project is a good fit. Book a time here: {booking_url}"

Email 3 subject: "Still interested in coaching, {first name}?"
Email 3 body:
"Checking in one more time on your Project coaching application. If you want to move forward, book your call here: {booking_url}. If the timing is not right, no problem. We can reconnect when it is."

## Failure Modes
- Sending more than 3 emails to an unresponsive lead
- Using urgency or scarcity language
- Generic emails that do not reference the lead's goal or application
- Emails longer than 10 sentences
