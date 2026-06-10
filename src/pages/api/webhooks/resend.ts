import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

type ResendEvent = {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from?: string;
    to?: string[];
    subject?: string;
    tags?: { name: string; value: string }[];
  };
};

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function verifySvixSignature(
  rawBody: Buffer,
  headers: Record<string, string | string[] | undefined>,
  secret: string
): boolean {
  const msgId = headers['svix-id'] as string;
  const msgTimestamp = headers['svix-timestamp'] as string;
  const msgSignature = headers['svix-signature'] as string;

  if (!msgId || !msgTimestamp || !msgSignature) return false;

  // Reject timestamps older than 5 minutes
  const ts = parseInt(msgTimestamp, 10);
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const toSign = `${msgId}.${msgTimestamp}.${rawBody.toString()}`;
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const computed = crypto.createHmac('sha256', secretBytes).update(toSign).digest('base64');

  return msgSignature.split(' ').some((sig) => {
    const [, b64] = sig.split(',');
    return b64 === computed;
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  const rawBody = await getRawBody(req);

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (webhookSecret && !verifySvixSignature(rawBody, req.headers, webhookSecret)) {
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody.toString()) as ResendEvent;
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const { type, data } = event;
  if (!type || !data?.email_id) {
    res.status(400).json({ error: 'Missing event type or email_id' });
    return;
  }

  const category = data.tags?.find((t) => t.name === 'category')?.value ?? null;

  try {
    const supabase = getSupabaseAdmin();

    // Log to email_events table. Run this SQL in Supabase to create it:
    // CREATE TABLE IF NOT EXISTS email_events (
    //   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    //   email_id text NOT NULL,
    //   event_type text NOT NULL,
    //   category text,
    //   occurred_at timestamptz NOT NULL,
    //   created_at timestamptz DEFAULT now()
    // );
    await supabase.from('email_events').insert({
      email_id: data.email_id,
      event_type: type,
      category,
      occurred_at: event.created_at,
    });

    // Track booking link clicks back to the lead
    if (type === 'email.clicked') {
      await supabase
        .from('leads')
        .update({ booking_click_at: event.created_at })
        .or([
          `resend_email_2_id.eq.${data.email_id}`,
          `resend_email_3_id.eq.${data.email_id}`,
          `resend_email_4_id.eq.${data.email_id}`,
        ].join(','));
    }
  } catch (err) {
    console.error('Webhook DB write failed', err);
  }

  res.status(200).json({ ok: true });
}
