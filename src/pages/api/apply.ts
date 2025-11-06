import type { NextApiRequest, NextApiResponse } from 'next';

type ApplyRequestBody = {
  name?: string;
  email?: string;
  goals?: string;
};

async function forwardEmail(payload: Required<ApplyRequestBody>) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.APPLY_EMAIL_TO;
  const fromEmail =
    process.env.APPLY_EMAIL_FROM ?? 'Project Coaching <coach@projectfitness.co>';

  if (!apiKey || !toEmail) {
    console.log('New coaching application:', payload);
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `New coaching application from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nGoals: ${payload.goals}`
    })
  }).then(async (response) => {
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Resend API error: ${message}`);
    }
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, goals }: ApplyRequestBody = req.body ?? {};

  if (!name || !email || !goals) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    await forwardEmail({ name, email, goals });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error forwarding application', error);
    res.status(500).json({ error: 'Failed to send application. Please try again later.' });
  }
}
