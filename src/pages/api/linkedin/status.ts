import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenStatus } from '../../../lib/linkedinPost';

// GET /api/linkedin/status
// Returns current token connection status. Used by the admin UI.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const status = await getTokenStatus();
    return res.status(200).json(status);
  } catch {
    return res.status(200).json({ connected: false, expiresAt: null, daysUntilExpiry: null });
  }
}
