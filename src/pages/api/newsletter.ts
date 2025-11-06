import type { NextApiRequest, NextApiResponse } from 'next';

type NewsletterBody = {
  email?: string;
};

const NEWSLETTER_EMAIL_SUBJECT =
  process.env.NEWSLETTER_EMAIL_SUBJECT ?? 'New project. newsletter subscriber';

async function notify(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.NEWSLETTER_EMAIL_TO ??
    process.env.APPLY_EMAIL_TO ??
    'coach@projectfitness.co';
  const fromEmail =
    process.env.NEWSLETTER_EMAIL_FROM ??
    process.env.APPLY_EMAIL_FROM ??
    'Project. Coaching <apply@notifications.projectfitness.co>';

  if (!apiKey) {
    console.log('Newsletter signup:', email);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: NEWSLETTER_EMAIL_SUBJECT,
      text: `New subscriber: ${email}`
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend API error: ${detail}`);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email }: NewsletterBody = req.body ?? {};

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Valid email is required.' });
    return;
  }

  try {
    await notify(email.trim());
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Newsletter signup failed', error);
    res
      .status(500)
      .json({ error: 'Unable to subscribe right now. Please try again soon.' });
  }
}
