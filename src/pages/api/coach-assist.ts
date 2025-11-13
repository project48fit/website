import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goals, schedule, experience } = req.body ?? {};

  if (!goals) {
    return res.status(400).json({ error: 'Please share your goals.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.log('Coach assist request (no API key):', req.body);
    return res.status(200).json({
      summary: 'Thanks for sharing your goals. A coach will follow up shortly with a personalized plan.',
      recommendation: 'Performance Coaching',
      nextSteps: 'Expect a follow-up email within 24 hours.'
    });
  }

  try {
    const prompt = `You are Project Fitness, a premium online coaching brand.
Client goals: ${goals}
Schedule: ${schedule ?? 'Not provided'}
Experience: ${experience ?? 'Not provided'}

1) Summarize their goals in 2 sentences.
2) Recommend one of these tiers: Performance Coaching, Performance Coaching + Nutrition.
3) Suggest next steps in <100 words.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text =
      completion.choices[0]?.message?.content?.toString() ?? 'Coach review pending.';

    res.status(200).json({ summary: text });
  } catch (error) {
    console.error('Coach assist error', error);
    res.status(500).json({ error: 'Unable to process request right now.' });
  }
}
