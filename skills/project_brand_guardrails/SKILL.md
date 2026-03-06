# Project Brand Guardrails

## Purpose
Enforce Project Fitness brand rules on any proposed copy or UI text. Prevent generic, hype, or SaaS language.

## Inputs
- Target surface and page section
- Proposed copy changes
- Any related constraints from the request

## Outputs
- Pass or fail decision
- Required edits
- Red flags list

## Procedure
1) Confirm the target surface is allowed: Home, Apply, About, Coaching, Pricing, Emails.
2) Scan for banned language: scarcity, hype, SaaS tone, generic AI filler.
3) Ensure the service is clearly physical fitness coaching: strength training, conditioning, nutrition guidance.
4) Check tone: calm authority, concise, executive focused.
5) Verify no em dash characters.
6) Return edits in short, direct bullets.

## Failure Modes and Red Flags
- Any mention of limited spots, urgency, or countdowns
- Claims that sound like business consulting
- Copy that sounds like a generic marketing template
- Use of em dash characters
- Any pricing change or discount language

## Examples
Good:
- "Executive fitness coaching focused on strength, conditioning, and nutrition."
- "Request private coaching to build energy and consistency."

Bad:
- "Limited spots for our game changing system."
- "Scale your performance pipeline with our platform."
