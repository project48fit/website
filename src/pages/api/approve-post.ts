import type { NextApiRequest, NextApiResponse } from 'next';
import { postToLinkedIn } from '../../lib/linkedinPost';

// GET /api/approve-post?token={ADMIN_API_TOKEN}&content={base64url-encoded post}
// One-click approval link emailed by the linkedin-personal-post scheduled task.
// Decodes the content, posts to LinkedIn, and returns a plain-text confirmation.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed');
  }

  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken && req.query.token !== adminToken) {
    return res.status(401).send('Unauthorized');
  }

  const encoded = req.query.content;
  if (!encoded || typeof encoded !== 'string') {
    return res.status(400).send('Missing content parameter');
  }

  let content: string;
  try {
    content = Buffer.from(decodeURIComponent(encoded), 'base64').toString('utf8').trim();
  } catch {
    return res.status(400).send('Invalid content encoding');
  }

  if (!content || content.length === 0) {
    return res.status(400).send('Decoded content is empty');
  }

  if (content.length > 3000) {
    return res.status(400).send('Content exceeds LinkedIn 3000 character limit');
  }

  const result = await postToLinkedIn({ content });

  if (!result.ok) {
    return res.status(500).send('Failed to post to LinkedIn: ' + result.error);
  }

  return res.status(200).send('Post published to LinkedIn.');
}
