# Project Brand Guardrails

## Purpose
Enforce Project Fitness brand rules on any proposed copy or UI text. Prevent off-brand, hype, or consumer fitness language from reaching the site or emails.

## Brand Context
Project Fitness is a premium executive health and performance coaching company. The service is 1:1 coaching for executives, founders, and business owners. It is NOT a general fitness brand, gym, or consumer wellness product.

Target audience: executives and founders, aged 28-45, demanding schedules, willing to invest in premium coaching.

Current pricing:
- Executive Health & Performance Advisory: $250/month
- Executive Performance Elite: $500/month

## Inputs
- Target surface and page section
- Proposed copy (text, headlines, CTAs, emails)
- Any relevant context about the change

## Outputs
- PASS or FAIL decision
- Specific required edits with replacement text
- Flagged phrases with explanations

## Procedure
1) Identify the target surface: Home, Apply, About, Coaching, Resources, Emails, LinkedIn.
2) Scan for banned language (see list below).
3) Check tone: calm authority, concise, executive-focused, results-driven.
4) Verify pricing references match $250/month Advisory and $500/month Elite.
5) Confirm the service is identified as executive health and performance coaching.
6) Check for curly/smart quotes in TS/TSX code strings -- use straight ASCII quotes only.
7) Return edits as direct replacements, not vague suggestions.

## Banned Language
- Scarcity and urgency: "limited spots", "act now", "only X left", "last chance", countdowns
- Consumer fitness: "weight loss", "fat loss", "transformation", "kickstart", "challenge" (as fitness challenge), "crush it", "beast mode", "before and after"
- Hype: "game-changing", "revolutionary", "unlock your potential", "life-changing", "breakthrough"
- SaaS/consulting tone: "scale your performance pipeline", "optimize your growth", "leverage synergies", "platform"
- Casual/informal: "real life", "plugged in", "level up", "rep after rep", "flexes with your schedule", "you've got this"
- Weak CTAs: "learn more" as primary CTA, vague button text

## Required Language Patterns
- Service: "executive health and performance coaching" or "1:1 executive coaching"
- CTA: "Request Private Coaching" (hero), "Apply" (nav/footer)
- Audience: "executives", "founders", "business owners", "high-output professionals"
- Value: "structure", "accountability", "performance", "energy", "clarity", "discipline"

## Technical Flag
- Curly/smart quotes (' ' " ") inside TS/TSX string literals cause TypeScript build errors.
- Always use straight ASCII single quotes (') in JS/TS string delimiters.
- Curly quotes in JSX text content (between tags) are acceptable.

## Failure Modes
- Any scarcity or urgency language
- Consumer fitness framing (weight loss, transformations, challenges)
- Pricing that does not match $250/$500 tier structure
- Curly quotes inside TS/TSX string literals
- Copy that sounds like business consulting rather than coaching

## Examples
Good:
- "Private coaching for executives who need energy, clarity, and a body that performs."
- "A structured coaching system for executives who want professional accountability."
- "Request Private Coaching"

Bad:
- "Limited spots available for our game-changing system."
- "Unlock your potential and transform your body."
- "Scale your performance with our platform."
