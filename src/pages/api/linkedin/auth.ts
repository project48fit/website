import type { NextApiRequest, NextApiResponse } from 'next';

// Initiates the LinkedIn OAuth 2.0 flow for personal (member) posting.
// Uses w_member_social scope — available with the "Share on LinkedIn" product.
// No admin token required here; the OAuth flow itself is the security boundary.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'LINKEDIN_CLIENT_ID is not configured.' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://projectfitness.co';
  const redirectUri = `${baseUrl}/api/linkedin/callback`;

  // w_member_social: post as the authenticated member (Share on LinkedIn product)
  // openid profile: get the member ID from /v2/userinfo (OpenID Connect)
  const scopes = ['w_member_social', 'openid', 'profile'].join(' ');

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
