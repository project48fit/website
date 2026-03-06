import type { NextApiRequest, NextApiResponse } from 'next';

// Initiates the LinkedIn OAuth 2.0 flow for organization posting.
// Access this route at /api/linkedin/auth to begin authorization.
// Requires LINKEDIN_CLIENT_ID env var.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken) {
    const provided = req.query.token ?? req.headers['x-admin-token'];
    if (provided !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'LINKEDIN_CLIENT_ID is not configured.' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://projectfitness.co';
  const redirectUri = `${baseUrl}/api/linkedin/callback`;

  const scopes = [
    'w_organization_social',
    'r_organization_social',
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    state: 'linkedin_auth',
  });

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  res.redirect(authUrl);
}
