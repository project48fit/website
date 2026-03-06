# Project Reporting

## Purpose
Generate concise weekly pipeline reports tied to the North Star metric: booked consultation calls per week. Data is sourced from the Supabase leads table. Reports are emailed to the coaching team.

## North Star Metric
Booked calls per week. Tracked via booking_url_clicked_at in the leads table (timestamp set when applicant clicks the booking link after submitting their application). Note: this tracks booking link clicks, not confirmed calendar bookings -- the closest proxy available in Supabase.

Validation threshold: 3 executive clients acquired through LinkedIn = channel validated.

## Data Sources
- Supabase leads table (env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- Resend (env var: RESEND_API_KEY) for email delivery
- Recipients: COACH_NOTIFY_EMAILS env var (comma-separated)

## Supabase leads table fields
- id, full_name, email, phone
- primary_goal, training_days_per_week, consult_availability, start_timeframe, goals_detail
- utm_source, utm_medium, utm_campaign, utm_content, utm_term
- referrer, landing_url
- booking_url_clicked_at (null = did not click booking link)
- created_at

## Inputs
- Week range (start and end dates)
- Any notable changes or experiments run that week
- LinkedIn campaign status (active/paused/budget changes)

## Outputs
- Concise email report under 300 words
- Metric table + brief insights
- 1-3 actionable next steps

## Procedure
1) Query Supabase leads table for the specified week range using created_at filter.
2) Calculate: total new leads, leads with booking_url_clicked_at set, booking click rate.
3) Break down by primary_goal and utm_source to identify which ad sources and goals convert best.
4) Query all-time totals for baseline context.
5) Note any changes that week (copy updates, ad budget changes, new creatives).
6) Produce 1-3 next actions based on the data.
7) Format report and email via Resend to COACH_NOTIFY_EMAILS.

## Report Format
```
Project Fitness -- Weekly Pipeline Report
Week: {start date} to {end date}

THIS WEEK
New leads: {n}
Booking clicks: {n} ({rate}%)
Top goal: {most common primary_goal}
Top source: {most common utm_source or "direct"}

ALL TIME
Total leads: {n}
Total booking clicks: {n} ({rate}%)

LEAD DETAIL (this week)
{Name | Goal | Source | Booked? | Applied}

NEXT ACTIONS
- {1-3 specific actions based on data}
```

## Failure Modes
- Reporting "booked calls" as if confirmed calendar bookings -- always clarify these are booking link clicks
- Vague timeframe (always specify exact date range)
- Report over 300 words with no clear actions
- Sending without verifying env vars are present

## Examples
Good:
- "Booking clicks: 4 of 9 leads (44%). Top source: LinkedIn. Top goal: Energy & performance."
- "Next: 3 LinkedIn leads clicked but did not book -- surface for manual outreach."

Bad:
- "We had a great week with lots of interest"
- "Traffic was up, conversions unclear"
