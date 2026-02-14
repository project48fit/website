import type { NextApiRequest, NextApiResponse } from 'next';
import { sendLinkedInApplyConversion } from '../../../lib/linkedinCapi';

// Dev-only endpoint for testing LinkedIn CAPI.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const email = typeof req.query.email === 'string' ? req.query.email : undefined;
  const li_fat_id = typeof req.query.li_fat_id === 'string' ? req.query.li_fat_id : undefined;

  const result = await sendLinkedInApplyConversion({ email, li_fat_id });
  res.status(200).json(result);
}
