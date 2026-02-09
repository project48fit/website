import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseAdmin } from '../../lib/supabaseAdmin';

type BookingClickBody = {
  lead_id?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { lead_id }: BookingClickBody = req.body ?? {};

  if (!lead_id) {
    res.status(400).json({ error: 'lead_id is required.' });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('leads')
      .update({ booking_url_clicked_at: new Date().toISOString() })
      .eq('id', lead_id);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Booking click update failed', error);
    res.status(500).json({ error: 'Failed to update booking click.' });
  }
}
