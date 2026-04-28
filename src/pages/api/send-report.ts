
import type { NextApiRequest, NextApiResponse } from 'next';

type SendReportBody = {
  recipients: string[];
  subject: string;
  text: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: true } | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
  }

  const { recipients, subject, text } = req.body as SendReportBody;

  if (!recipients?.length || !subject || !text) {
    return res.status(400).json({ error: 'Missing recipients, subject, or text' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.APPLY_EMAIL_FROM ?? 'Project. Coaching <coach@projectfitness.co>',
      to: recipients,
      subject,
      text
    })
  });

  if (!response.ok) {
    const message = await response.text();
    return res.status(500).json({ error: `Resend error: ${message}` });
  }

  return res.status(200).json({ ok: true });
}
