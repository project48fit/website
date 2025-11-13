import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { highlights } = req.body ?? {};
  if (!highlights) {
    return res.status(400).json({ error: 'Please provide newsletter highlights or bullet points.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({
      draft: `Newsletter Draft\n\nHighlights:\n${highlights}\n\nAdd your final copy here.`
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `You are Project Fitness. Turn these bullet points into a concise newsletter update with intro, body, and CTA.\n\n${highlights}`
        }
      ],
      temperature: 0.7
    });

    const text =
      completion.choices[0]?.message?.content?.toString() ?? 'Newsletter draft unavailable.';

    res.status(200).json({ draft: text });
  } catch (error) {
    console.error('Newsletter draft error', error);
    res.status(500).json({ error: 'Unable to draft newsletter right now.' });
  }
}
