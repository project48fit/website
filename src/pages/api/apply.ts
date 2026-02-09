import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../lib/supabaseAdmin';

type ApplyRequestBody = {
  full_name?: string;
  email?: string;
  phone?: string;
  primary_goal?: string;
  training_days_per_week?: string;
  consult_availability?: string;
  start_timeframe?: string;
  goals_detail?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_url?: string;
};

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
  const bookingUrl = process.env.BOOKING_URL ?? '';
  const scheduledAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const subject = 'Next step: book your Project. coaching call';
  const text = [
    `Hey ${payload.full_name}, thanks for filling out the Project. coaching form.`,
    '',
    'You took the first step toward getting structure, accountability, and a fitness plan that fits your life.',
    '',
    "Here's what happens next:",
    'Caleb and I run a short 15–20 minute coaching call to:',
    '- Understand your goals and training history',
    "- Identify what’s been holding you back",
    '- See if Project is the right fit for you moving forward',
    '',
    "If it is, we’ll outline how we’d coach you. If it’s not, we’ll tell you that too.",
    '',
    'Book your call here:',
    bookingUrl,
    '',
    "Spots are limited each week so we can stay hands-on with our clients. If you’re serious about making progress, book your time now.",
    '',
    'Talk soon,',
    'Birk & Caleb',
    'Project. Fitness',
    'Website: https://projectfitness.co'
  ].join('\n');

  const html = `
    <p>Hey ${payload.full_name}, thanks for filling out the Project. coaching form.</p>
    <p>You took the first step toward getting structure, accountability, and a fitness plan that fits your life.</p>
    <p><strong>Here’s what happens next:</strong><br />
      Caleb and I run a short 15–20 minute coaching call to:</p>
    <ul>
      <li>Understand your goals and training history</li>
      <li>Identify what’s been holding you back</li>
      <li>See if Project is the right fit for you moving forward</li>
    </ul>
    <p>If it is, we’ll outline how we’d coach you. If it’s not, we’ll tell you that too.</p>
    <p><strong>Book your call here:</strong><br />
      <a href="${bookingUrl}">${bookingUrl}</a>
    </p>
    <p>Spots are limited each week so we can stay hands-on with our clients. If you’re serious about making progress, book your time now.</p>
    <p>Talk soon,<br />
      <strong>Birk &amp; Caleb</strong><br />
      Project. Fitness<br />
      Website: <a href="https://projectfitness.co">projectfitness.co</a>
    </p>
    <p><img src="https://projectfitness.co/full_logo.png" alt="Project. Fitness" style="max-width: 240px; height: auto;" /></p>
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

  const body: ApplyRequestBody = req.body ?? {};
  const {
    full_name,
    email,
    phone,
    primary_goal,
    training_days_per_week,
    consult_availability,
    start_timeframe
  } = body;

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

    res.status(200).json({ ok: true, lead_id: data.id });
  } catch (error) {
    console.error('Lead submission failed', error);
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
}
