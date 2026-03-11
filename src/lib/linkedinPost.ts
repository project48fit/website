import { getSupabaseAdmin } from './supabaseAdmin';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/rest';
const LINKEDIN_VERSION = '202502';
const TOKEN_REFRESH_BUFFER_SECONDS = 60 * 60 * 24 * 5; // refresh 5 days before expiry

type LinkedInTokenRow = {
  id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string;
  member_id: string | null;
};

type PostLinkedInParams = {
  content: string;
};

type PostLinkedInResult = {
  ok: boolean;
  postId?: string;
  error?: string;
};

async function getStoredToken(): Promise<LinkedInTokenRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('linkedin_tokens')
    .select('id, access_token, refresh_token, expires_at, member_id')
    .eq('id', 'default')
    .single();

  if (error || !data) return null;
  return data as LinkedInTokenRow;
}

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number; refresh_token?: string } | null> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) return null;
  return res.json();
}

async function getValidToken(): Promise<{ token: string; memberId: string } | null> {
  const row = await getStoredToken();
  if (!row || !row.member_id) return null;

  const expiresAt = new Date(row.expires_at).getTime() / 1000;
  const now = Math.floor(Date.now() / 1000);

  // Token is still valid and not within the refresh buffer
  if (expiresAt - now > TOKEN_REFRESH_BUFFER_SECONDS) {
    return { token: row.access_token, memberId: row.member_id };
  }

  // Attempt refresh if we have a refresh token
  if (!row.refresh_token) return null;

  const refreshed = await refreshAccessToken(row.refresh_token);
  if (!refreshed) return null;

  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  const supabase = getSupabaseAdmin();
  await supabase
    .from('linkedin_tokens')
    .upsert({
      id: 'default',
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token ?? row.refresh_token,
      expires_at: newExpiresAt,
      member_id: row.member_id,
    });

  return { token: refreshed.access_token, memberId: row.member_id };
}

export async function postToLinkedIn({ content }: PostLinkedInParams): Promise<PostLinkedInResult> {
  const auth = await getValidToken();
  if (!auth) return { ok: false, error: 'No valid LinkedIn access token. Re-authorize at /admin/linkedin.' };

  const body = {
    author: `urn:li:person:${auth.memberId}`,
    commentary: content,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch(`${LINKEDIN_API_BASE}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`,
      'LinkedIn-Version': LINKEDIN_VERSION,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `LinkedIn API error ${res.status}: ${text}` };
  }

  // LinkedIn returns the post ID in the x-linkedin-id header
  const postId = res.headers.get('x-linkedin-id') ?? undefined;
  return { ok: true, postId };
}

export async function storeLinkedInTokens(params: {
  access_token: string;
  refresh_token: string | null;
  expires_in: number;
  member_id: string;
}) {
  const supabase = getSupabaseAdmin();
  const expiresAt = new Date(Date.now() + params.expires_in * 1000).toISOString();

  const { error } = await supabase
    .from('linkedin_tokens')
    .upsert({
      id: 'default',
      access_token: params.access_token,
      refresh_token: params.refresh_token,
      expires_at: expiresAt,
      member_id: params.member_id,
    });

  if (error) throw new Error(`Failed to store tokens: ${error.message}`);
}

export async function getTokenStatus(): Promise<{
  connected: boolean;
  expiresAt: string | null;
  daysUntilExpiry: number | null;
}> {
  const row = await getStoredToken();
  if (!row) return { connected: false, expiresAt: null, daysUntilExpiry: null };

  const expiresAt = new Date(row.expires_at);
  const daysUntilExpiry = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return {
    connected: daysUntilExpiry > 0,
    expiresAt: expiresAt.toISOString(),
    daysUntilExpiry,
  };
}
