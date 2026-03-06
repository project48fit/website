import type { NextApiRequest, NextApiResponse } from 'next';
import { postToLinkedIn } from '../../../lib/linkedinPost';

type PostBody = {
  content?: string;
};

// POST /api/linkedin/post
// Body: { content: string }
// Protected by ADMIN_API_TOKEN env var (optional but recommended).
// Used by the admin UI and the LinkedIn posting agent.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken) {
    const provided =
      req.headers['x-admin-token'] ??
      (req.body as Record<string, unknown>)?.admin_token;
    if (provided !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const { content } = req.body as PostBody;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'content is required.' });
  }

  if (content.length > 3000) {
    return res.status(400).json({ error: 'content exceeds LinkedIn 3000 character limit.' });
  }

  const result = await postToLinkedIn({ content: content.trim() });

  if (!result.ok) {
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json({ ok: true, postId: result.postId });
}
