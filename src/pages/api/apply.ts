
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { sendLinkedInApplyConversion } from '../../lib/linkedinCapi';

type ApplyRequestBody = {
  full_name?: string;
  email?: string;
  phone?: string;
  primary_goal?: string;
  training_days_per_week?: string;
  consult_availability?: string;
  start_timeframe?: string;
  goals_detail?: string;
  company_website?: string;
  li_fat_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_url?: string;
};

async function isRateLimited(ip: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;

  const key = `rate:apply:${ip}`;
  const incrResponse = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const incrData = await incrResponse.json();
  const count = typeof incrData.result === 'number' ? incrData.result : 0;

  if (count === 1) {
    await fetch(`${url}/expire/${encodeURIComponent(key)}/600`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  return count > 5;
}

async function notifyCoaches(payload: ApplyRequestBody, leadId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmails = process.env.COACH_NOTIFY_EMAILS ?? '';
  const fromEmail =
    process.env.APPLY_EMAIL_FROM ?? 'Project Coaching <coach@projectfitness.co>';

  if (!apiKey || !toEmails) {
    console.log('Lead received (email not configured):', { leadId, ...payload });
    return;
  }

  const recipients = toEmails
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) return;

  const text = [
    `Lead ID: ${leadId}`,
    `Name: ${payload.full_name ?? ''}`,
    `Email: ${payload.email ?? ''}`,
    `Phone: ${payload.phone ?? ''}`,
    `Primary goal: ${payload.primary_goal ?? ''}`,
    `Training days/week: ${payload.training_days_per_week ?? ''}`,
    `Consult availability: ${payload.consult_availability ?? ''}`,
    `Start timeframe: ${payload.start_timeframe ?? ''}`,
    `Goals detail: ${payload.goals_detail ?? ''}`,
    '',
    `utm_source: ${payload.utm_source ?? ''}`,
    `utm_medium: ${payload.utm_medium ?? ''}`,
    `utm_campaign: ${payload.utm_campaign ?? ''}`,
    `utm_content: ${payload.utm_content ?? ''}`,
    `utm_term: ${payload.utm_term ?? ''}`,
    `referrer: ${payload.referrer ?? ''}`,
    `landing_url: ${payload.landing_url ?? ''}`
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipients,
      subject: `New coaching application — ${payload.full_name ?? 'Unknown'}`,
      text
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend API error: ${message}`);
  }
}

async function sendApplicantConfirmation(payload: ApplyRequestBody) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !payload.email || !payload.full_name) return;

  const fromEmail =
    process.env.APPLY_CONFIRMATION_FROM ??
    'Project Fitness <marketing@notifications.projectfitness.co>';
  const bookingUrl =
    process.env.BOOKING_URL ?? 'https://calendar.app.google/c7qR2kRWT7HLDQBYA';
  const scheduledAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const firstName = payload.full_name.trim().split(' ')[0] || payload.full_name;

  const subject = 'Thanks for Applying — Book Your Call';
  const text = [
    `Hey ${firstName},`,
    '',
    'Thanks for taking the time to fill out the Project coaching application. We appreciate it.',
    '',
    'The next step is simple.',
    '',
    'Book your 15 to 20 minute coaching call so we can:',
    '• Understand your goals and training history',
    '• Identify what has been holding you back',
    '• Walk through what coaching would look like for you',
    '',
    'This call gives you clarity on whether Project is the right fit for where you are now.',
    '',
    'Use the link below to find a time that works for you.',
    '',
    bookingUrl,
    '',
    'Talk soon,',
    'Birk & Caleb',
    'Founders of Project Fitness',
    'projectfitness.co'
  ].join('\n');

  const html = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede0; padding:32px 16px; font-family: Arial, sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#fdfaf3; border:1px solid #0e0e0e;">
          <tr>
            <td style="padding:24px 24px 0 24px; text-align:center;">
              <img src="https://projectfitness.co/full_logo.png" alt="Project Fitness" width="220" style="display:block; margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px; color:#0e0e0e; font-size:16px; line-height:1.5;">
              <p style="margin:0 0 12px 0;">Hey ${firstName},</p>
              <p style="margin:0 0 12px 0;">Thanks for taking the time to fill out the Project coaching application. We appreciate it.</p>
              <p style="margin:0 0 12px 0;">The next step is simple.</p>
              <p style="margin:0 0 12px 0;">Book your 15 to 20 minute coaching call so we can:</p>
              <ul style="margin:0 0 12px 18px; padding:0;">
                <li>Understand your goals and training history</li>
                <li>Identify what has been holding you back</li>
                <li>Walk through what coaching would look like for you</li>
              </ul>
              <p style="margin:0 0 20px 0;">This call gives you clarity on whether Project is the right fit for where you are now.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
                <tr>
                  <td bgcolor="#0e0e0e" style="padding:14px 22px; text-align:center;">
                    <a href="${bookingUrl}" style="color:#f2ede0; text-decoration:none; text-transform:uppercase; letter-spacing:0.2em; font-size:12px; font-weight:700; display:inline-block;">
                      Book your coaching call
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px 0; font-size:13px;">
                If the button does not work, use this link:
                <br />
                <a href="${bookingUrl}" style="color:#0e0e0e; text-decoration:underline;">${bookingUrl}</a>
              </p>
              <p style="margin:20px 0 0 0;">Talk soon,<br />Birk &amp; Caleb<br />Founders of Project Fitness<br />projectfitness.co</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [payload.email],
      subject,
      text,
      html,
      scheduled_at: scheduledAt,
      tags: [{ name: 'category', value: 'apply_confirmation' }]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend confirmation error: ${message}`);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const ip =
    (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : undefined) ||
    req.socket.remoteAddress ||
    'unknown';

  if (await isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const body: ApplyRequestBody = req.body ?? {};
  const {
    full_name,
    email,
    phone,
    primary_goal,
    training_days_per_week,
    consult_availability,
    start_timeframe,
    company_website,
    li_fat_id
  } = body;

  if (company_website && company_website.trim().length > 0) {
    res.status(200).json({ ok: true });
    return;
  }

  if (
    !full_name ||
    !email ||
    !phone ||
    !primary_goal ||
    !training_days_per_week ||
    !consult_availability ||
    !start_timeframe
  ) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          full_name: body.full_name,
          email: body.email,
          phone: body.phone,
          primary_goal: body.primary_goal,
          training_days_per_week: body.training_days_per_week,
          consult_availability: body.consult_availability,
          start_timeframe: body.start_timeframe,
          goals_detail: body.goals_detail ?? null,
          utm_source: body.utm_source ?? null,
          utm_medium: body.utm_medium ?? null,
          utm_campaign: body.utm_campaign ?? null,
          utm_content: body.utm_content ?? null,
          utm_term: body.utm_term ?? null,
          referrer: body.referrer ?? null,
          landing_url: body.landing_url ?? null
        }
      ])
      .select('id')
      .single();

    if (error || !data?.id) {
      throw new Error(error?.message ?? 'Failed to store lead.');
    }

    await notifyCoaches(body, data.id);
    sendApplicantConfirmation(body).catch((err) =>
      console.error('Applicant confirmation failed', err)
    );
    sendLinkedInApplyConversion({ email, li_fat_id }).catch((err) =>
      console.error('LinkedIn conversion failed', err)
    );

    res.status(200).json({ ok: true, lead_id: data.id });
  } catch (error) {
    console.error('Lead submission failed', error);
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
}
