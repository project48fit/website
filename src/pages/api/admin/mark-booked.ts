import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken && req.headers['x-admin-token'] !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { email } = req.body as { email?: string };
  if (!email?.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const supabase = getSupabaseAdmin();

  const { data: lead, error } = await supabase
    .from('leads')
    .select('id, email, resend_email_2_id, resend_email_3_id, resend_email_4_id, call_booked_at')
    .eq('email', email.trim().toLowerCase())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !lead) {
    return res.status(404).json({ error: 'No lead found for that email.' });
  }

  if (lead.call_booked_at) {
    return res.status(200).json({ ok: true, already_booked: true });
  }

  const resendKey = process.env.RESEND_API_KEY_2;
  if (resendKey) {
    const emailIds = [
      lead.resend_email_2_id,
      lead.resend_email_3_id,
      lead.resend_email_4_id,
    ].filter(Boolean);

    await Promise.allSettled(
      emailIds.map((id) =>
        fetch(`https://api.resend.com/emails/${id}/cancel`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendKey}` },
        })
      )
    );
  }

  const { error: updateError } = await supabase
    .from('leads')
    .update({ call_booked_at: new Date().toISOString() })
    .eq('id', lead.id);

  if (updateError) {
    console.error('Failed to update call_booked_at', updateError);
    return res.status(500).json({ error: 'Failed to mark as booked.' });
  }

  return res.status(200).json({ ok: true, lead_id: lead.id });
}
