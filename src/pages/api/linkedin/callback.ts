import type { NextApiRequest, NextApiResponse } from 'next';
import { storeLinkedInTokens } from '../../../lib/linkedinPost';

// Handles the OAuth callback from LinkedIn after user authorization.
// LinkedIn redirects here with ?code={auth_code} after the user approves.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(`
      <html><body style="font-family:monospace;padding:40px;background:#050506;color:#F5F6F7;">
        <h2>LinkedIn auth failed</h2>
        <p>Error: ${String(error)}</p>
        <p>${String(error_description ?? '')}</p>
        <a href="/admin/linkedin" style="color:#F2EDE0;">Back to admin</a>
      </body></html>
    `);
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code.' });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'LinkedIn client credentials are not configured.' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://projectfitness.co';
  const redirectUri = `${baseUrl}/api/linkedin/callback`;

  // Exchange auth code for access + refresh tokens
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString(),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return res.status(500).send(`
      <html><body style="font-family:monospace;padding:40px;background:#050506;color:#F5F6F7;">
        <h2>Token exchange failed</h2>
        <p>${text}</p>
        <a href="/admin/linkedin" style="color:#F2EDE0;">Back to admin</a>
      </body></html>
    `);
  }

  const tokens = await tokenRes.json() as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
  };

  await storeLinkedInTokens({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    expires_in: tokens.expires_in,
  });

  res.send(`
    <html><body style="font-family:monospace;padding:40px;background:#050506;color:#F5F6F7;">
      <h2 style="color:#F2EDE0;">LinkedIn connected successfully.</h2>
      <p>Access token stored. Expires in ${Math.floor(tokens.expires_in / 86400)} days.</p>
      ${tokens.refresh_token ? '<p>Refresh token stored — auto-renewal is enabled.</p>' : '<p>No refresh token received — you will need to re-authorize in 60 days.</p>'}
      <a href="/admin/linkedin" style="color:#F2EDE0;">Back to admin</a>
    </body></html>
  `);
}
