# Project LinkedIn Content

## Purpose
Generate LinkedIn posts and ad copy that attract executive and founder-level prospects to Project Fitness. LinkedIn is the primary acquisition channel. All content must drive qualified traffic to /apply.

## Content Context
LinkedIn is used to target professionals and executives. The goal is to validate the channel by acquiring 3+ executive clients from LinkedIn advertising. Content must feel credible and authoritative -- not like a fitness ad.

Target viewer: 28-45 year old executive or founder who feels their health is slipping due to their schedule. They understand the value of investing in systems and accountability.

## Content Types
1. Organic posts -- thought leadership, performance insights, behind-the-scenes coaching
2. Video ad scripts -- founder-facing, direct to camera, speak to pain points
3. Ad copy -- headline + body for LinkedIn paid ads, paired with a CTA to apply

## Inputs
- Content type (organic post, video script, ad copy)
- Topic or angle
- Any specific pain points, offers, or messaging to include
- Target: executives, founders, or both

## Outputs
- Organic post: hook line, body (3-5 short paragraphs or bullets), CTA
- Video script: hook (first 3 seconds), body (30-60 seconds), CTA
- Ad copy: headline (under 70 chars), primary text (under 150 chars), CTA button label

## Procedure

### Organic Posts
1) Open with a hook that speaks directly to an executive pain point (energy, consistency, schedule, performance).
2) Body: 3-5 short paragraphs or punchy bullets. Each line earns the next.
3) Avoid fluffy inspiration -- speak in specifics and results.
4) End with a soft CTA: invite them to apply or DM, not a hard sell.
5) No hashtag stacking -- max 2 relevant hashtags if any.

### Video Ad Scripts
1) First 3 seconds must hook: name the pain or the outcome directly.
2) Establish credibility briefly (who we work with, what we build).
3) Explain the mechanism: personalized program + accountability + check-ins.
4) Speak to the objection: "too busy" or "tried before and failed."
5) CTA: "Link in bio to apply" or "Apply at projectfitness.co"
6) Keep total runtime under 60 seconds.

### Ad Copy
1) Headline: name the target and the outcome or problem in under 70 chars.
2) Primary text: one or two sentences, pain point + credibility signal.
3) CTA: "Apply now" or "Request coaching"
4) Destination URL: projectfitness.co/apply

## Tone
- Direct and credible, not hype-driven
- First-person from the founders (Birk and Caleb) where possible
- Speak to professional identity, not body image
- Performance and energy framing, not aesthetics

## Banned Patterns
- Before/after framing or transformation promises
- Body image language (lose weight, slim down, look better)
- Gimmicks or challenges
- Motivational fluff ("you've got this", "believe in yourself")
- Excessive hashtags

## Messaging Angles That Work for This Audience
- Energy: "Your output depends on your physical baseline."
- Schedule: "Built around your calendar, not a generic plan."
- Accountability: "The system does what motivation can't."
- Identity: "Executives who treat health like a business asset."
- Proof: Keith T. quote -- "The accountability and commitment that comes with investing in Project is the difference maker."

## Posting to LinkedIn (API)

To post content directly to the Project Fitness LinkedIn company page:

1. Generate the post content following the procedures above.
2. Verify content is under 3000 characters and passes brand guardrails.
3. POST to the site API:

```
POST https://projectfitness.co/api/linkedin/post
Headers:
  Content-Type: application/json
  x-admin-token: {ADMIN_API_TOKEN env var value}
Body:
  { "content": "your post text here" }
```

4. A 200 response with { ok: true, postId: "..." } confirms the post is live.
5. If the response is 500 with "No valid LinkedIn access token", the token needs renewal at /admin/linkedin.

Admin UI for manual posting: https://projectfitness.co/admin/linkedin

## Examples
Good hook lines:
- "Your schedule is the excuse. Our system removes it."
- "Most executives know what to do. They just don't have the structure to do it consistently."
- "High performance at work starts with how you treat your body."

Bad hook lines:
- "Are you ready to transform your life?"
- "Lose weight and feel great with our proven system!"
