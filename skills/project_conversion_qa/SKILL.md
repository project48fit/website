# Project Conversion QA

## Purpose
Audit key pages for conversion readiness and brand compliance. The North Star metric is booked consultation calls per week, tracked via booking link clicks (booking_url_clicked_at in Supabase leads table).

## Funnel Structure
LinkedIn Ad -> projectfitness.co (hero) -> /apply (form) -> [submit] -> booking link click -> booked call

Step-by-step:
1. Visitor lands on home page (hero only -- no scroll content below fold)
2. Clicks "Request Private Coaching" -> redirected to /apply
3. Fills out application form (9 fields: name, email, phone, goal, training days, availability, timeframe, detail, spam trap)
4. Submits form -> success state displays "Book your consult" button
5. Booking link click is tracked in Supabase as booking_url_clicked_at

## Page Inventory (current)
- `/` -- Hero only. One CTA: "Request Private Coaching" -> /apply
- `/apply` -- Full application form + conversion copy on left panel
- `/coaching` -- Pricing: Advisory $250/mo and Elite $500/mo
- `/about` -- Approach cards + team bios
- `/resources` -- Newsletter + PDF download
- Navbar: "About" | "Pricing" | "Apply" (primary CTA button, both desktop and mobile)
- Footer: About | Pricing | Apply links

## Inputs
- Pages or components to review
- Recent copy changes or draft content
- Specific conversion concern or experiment

## Outputs
- PASS or FAIL for each element reviewed
- Friction points with specific recommended fixes
- Risks to booking click rate

## Procedure
1) Verify "Request Private Coaching" CTA is above the fold on the home page and links to /apply.
2) Check /apply left panel: headline, "Who it's for", "How it works", and "What you can expect" sections all target executives specifically.
3) Confirm form fields are clear and options are appropriate for the executive audience.
4) Verify the post-submit success state surfaces the booking link immediately and prominently.
5) Check /coaching shows both pricing tiers correctly ($250 Advisory, $500 Elite) with full feature lists.
6) Confirm navbar "Apply" button appears on both desktop and mobile views.
7) Check for any copy that could cause an executive to self-select out incorrectly or lose trust.
8) Flag any scarcity, hype, or consumer fitness language anywhere in the funnel.

## Failure Modes
- "Request Private Coaching" CTA missing or not above the fold on home page
- Apply form has ambiguous field labels or consumer fitness goal options (e.g. "Fat loss")
- Post-submit success state buries or delays the booking link
- Pricing page shows incorrect amounts or is missing one of the two tiers
- Navbar missing "Apply" button on mobile
- Left panel copy targets a general audience rather than executives
- Testimonial is generic or lacks credibility markers (name, title)
- Booking link is broken or expired

## Key Conversion Points to Protect
- Hero CTA: "Request Private Coaching" -- must be above the fold, links to /apply
- Apply form: must submit cleanly and immediately show booking link on success
- Booking link: must be functional (check periodically)
- Nav "Apply" button: must appear on both desktop and mobile

## Examples
Good:
- "Request Private Coaching" as the only hero CTA, above fold
- Booking link displayed immediately in success state after form submission
- Testimonial: "The accountability and commitment that comes with investing in Project is the difference maker." -- Keith T., Executive Coaching Client

Bad:
- "Learn more" as the only CTA on the home page
- Booking step requires an extra page load after form submission
- Goal dropdown includes "Fat loss" (consumer fitness framing)
