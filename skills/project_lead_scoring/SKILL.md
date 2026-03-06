# Project Lead Scoring

## Purpose
Evaluate incoming leads from the Supabase leads table and score them for conversion likelihood and coaching fit. Output a prioritized follow-up list for the coaching team. High scores get immediate personal outreach. Low scores get deprioritized.

## Scoring Model

### Positive signals (add points)
- primary_goal = "Energy & performance" or "Strength" or "Overall health" (+2 each) -- aligned with executive positioning
- primary_goal = "Body composition" or "Muscle gain" (+1 each) -- acceptable but less aligned
- start_timeframe = "ASAP" (+3) -- high intent
- start_timeframe = "2-4 weeks" (+2)
- start_timeframe = "1-2 months" (+1)
- training_days_per_week = "3-4" or "5+" (+2) -- already committed to training
- utm_source = "linkedin" (+2) -- target channel, higher quality
- goals_detail present and substantive (50+ chars) (+2) -- invested in the process
- consult_availability = "Mornings" or "Flexible" (+1) -- easy to schedule

### Negative signals (subtract points)
- goals_detail is empty or very short (under 20 chars) (-1) -- low effort application
- primary_goal = "Other" (-1) -- unclear fit
- start_timeframe = "1-2 months" with no goals_detail (-1) -- low urgency + low effort
- No utm_source (direct traffic, unknown origin) (0, neutral)

### Score thresholds
- 7+ points: HIGH priority -- personal outreach within 24 hours
- 4-6 points: MEDIUM priority -- standard follow-up sequence
- 0-3 points: LOW priority -- email sequence only, no personal outreach unless they respond

## Inputs
- Lead data from Supabase (full_name, email, phone, primary_goal, training_days_per_week, start_timeframe, consult_availability, goals_detail, utm_source, created_at)
- Can score a single lead or a batch from the past N days

## Outputs
- Score (numeric) and tier (HIGH / MEDIUM / LOW) for each lead
- 1-2 sentence rationale
- Recommended follow-up action

## Procedure
1) Read lead data provided or query Supabase for leads in the given timeframe.
2) Apply the scoring model to each lead.
3) Sort leads by score descending.
4) For each lead, output: name, email, score, tier, rationale, recommended action.
5) Summarize: count by tier, top source, top goal.

## Output Format
```
Lead Scoring Report -- {date}

HIGH PRIORITY ({n} leads)
{Name} | {email} | Score: {n}
Goal: {primary_goal} | Source: {utm_source} | Timeframe: {start_timeframe}
Rationale: {1-2 sentences}
Action: Personal outreach within 24 hours. Reference their goal and availability.

MEDIUM PRIORITY ({n} leads)
...

LOW PRIORITY ({n} leads)
...

SUMMARY
Total leads scored: {n}
High: {n} | Medium: {n} | Low: {n}
Top goal: {most common}
Top source: {most common}
```

## Failure Modes
- Scoring without reading all available fields (missing data = inaccurate score)
- Treating all leads the same regardless of intent signals
- Over-weighting source at the expense of intent signals (goals_detail, start_timeframe)

## Examples
High priority lead:
- Goal: Energy & performance (+2), ASAP start (+3), 3-4 days/week (+2), LinkedIn source (+2), detailed goals (+2) = 11 points

Low priority lead:
- Goal: Other (-1), 1-2 months start (+1), goals_detail empty (-1), direct source (0) = -1 points
