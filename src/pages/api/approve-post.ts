import type { NextApiRequest, NextApiResponse } from 'next';
import { postToLinkedIn } from '../../lib/linkedinPost';
import { getSupabaseAdmin } from '../../lib/supabaseAdmin';

// GET /api/approve-post?token={ADMIN_API_TOKEN}&draft_id={uuid}
// One-click approval link emailed by the linkedin-personal-post scheduled task.
// Fetches draft content from Supabase by ID, posts to LinkedIn, marks as approved.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed');
  }

  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken && req.query.token !== adminToken) {
    return res.status(401).send('Unauthorized');
  }

  const draftId = req.query.draft_id;
  if (!draftId || typeof draftId !== 'string') {
    return res.status(400).send('Missing draft_id parameter');
  }

  const supabase = getSupabaseAdmin();
  const { data: draft, error } = await supabase
    .from('linkedin_drafts')
    .select('id, content, approved_at')
    .eq('id', draftId)
    .single();

  if (error || !draft) {
    return res.status(404).send('Draft not found');
  }

  if (draft.approved_at) {
    return res.status(409).send('Draft already approved and posted');
  }

  const content = draft.content.trim();

  if (content.length > 3000) {
    return res.status(400).send('Content exceeds LinkedIn 3000 character limit');
  }

  const result = await postToLinkedIn({ content });

  if (!result.ok) {
    return res.status(500).send('Failed to post to LinkedIn: ' + result.error);
  }

  await supabase
    .from('linkedin_drafts')
    .update({ approved_at: new Date().toISOString() })
    .eq('id', draftId);

  return res.status(200).send('Post published to LinkedIn.');
}
