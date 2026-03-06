import { useEffect, useState } from 'react';

type TokenStatus = {
  connected: boolean;
  expiresAt: string | null;
  daysUntilExpiry: number | null;
};

export default function LinkedInAdminPage() {
  const [status, setStatus] = useState<TokenStatus | null>(null);
  const [content, setContent] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetch('/api/linkedin/status')
      .then((r) => r.json())
      .then((data: TokenStatus) => setStatus(data))
      .catch(() => setStatus({ connected: false, expiresAt: null, daysUntilExpiry: null }))
      .finally(() => setLoadingStatus(false));
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    setResult(null);

    try {
      const res = await fetch('/api/linkedin/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'x-admin-token': adminToken } : {}),
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `Posted successfully. Post ID: ${data.postId ?? 'unknown'}` });
        setContent('');
      } else {
        setResult({ ok: false, message: data.error ?? 'Unknown error' });
      }
    } catch {
      setResult({ ok: false, message: 'Network error. Check your connection.' });
    } finally {
      setPosting(false);
    }
  };

  const charCount = content.length;
  const overLimit = charCount > 3000;

  return (
    <div style={{ background: '#050506', minHeight: '100vh', padding: '48px 24px', fontFamily: 'monospace', color: '#F5F6F7' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9EA3AE' }}>
          Admin
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginTop: 8, color: '#F2EDE0' }}>
          LinkedIn Publisher
        </h1>

        {/* Connection status */}
        <div style={{ marginTop: 32, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9EA3AE', marginBottom: 12 }}>
            Connection status
          </p>
          {loadingStatus ? (
            <p style={{ color: '#9EA3AE', fontSize: 14 }}>Checking...</p>
          ) : status?.connected ? (
            <>
              <p style={{ color: '#4ade80', fontSize: 14, marginBottom: 4 }}>
                Connected — token expires in {status.daysUntilExpiry} days
              </p>
              {status.daysUntilExpiry !== null && status.daysUntilExpiry < 10 && (
                <p style={{ color: '#fbbf24', fontSize: 13 }}>
                  Token expiring soon. Re-authorize to continue posting.
                </p>
              )}
            </>
          ) : (
            <p style={{ color: '#F2503A', fontSize: 14 }}>
              Not connected. Authorize below to enable posting.
            </p>
          )}

          <a
            href="/api/linkedin/auth"
            style={{
              display: 'inline-block',
              marginTop: 16,
              padding: '10px 20px',
              background: '#0077B5',
              color: '#fff',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {status?.connected ? 'Re-authorize LinkedIn' : 'Connect LinkedIn'}
          </a>
        </div>

        {/* Admin token */}
        <div style={{ marginTop: 24 }}>
          <label style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9EA3AE', display: 'block', marginBottom: 8 }}>
            Admin token (if required)
          </label>
          <input
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="ADMIN_API_TOKEN value"
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: '12px 16px',
              color: '#F5F6F7',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Post composer */}
        <div style={{ marginTop: 32 }}>
          <label style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9EA3AE', display: 'block', marginBottom: 8 }}>
            Post content
          </label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your LinkedIn post here..."
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.4)',
              border: `1px solid ${overLimit ? '#F2503A' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 12,
              padding: '16px',
              color: '#F5F6F7',
              fontSize: 14,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'monospace',
              lineHeight: 1.6,
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: overLimit ? '#F2503A' : '#9EA3AE' }}>
              {charCount} / 3000 characters
            </span>
            {overLimit && (
              <span style={{ fontSize: 12, color: '#F2503A' }}>Over LinkedIn limit</span>
            )}
          </div>
        </div>

        <button
          onClick={handlePost}
          disabled={posting || !content.trim() || overLimit || !status?.connected}
          style={{
            marginTop: 20,
            padding: '14px 32px',
            background: posting || !content.trim() || overLimit || !status?.connected ? 'rgba(255,255,255,0.2)' : '#F2EDE0',
            color: '#050506',
            border: 'none',
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: posting || !content.trim() || overLimit || !status?.connected ? 'not-allowed' : 'pointer',
            opacity: posting || !content.trim() || overLimit || !status?.connected ? 0.5 : 1,
          }}
        >
          {posting ? 'Posting...' : 'Post to LinkedIn'}
        </button>

        {result && (
          <div style={{
            marginTop: 20,
            padding: '16px 20px',
            borderRadius: 12,
            background: result.ok ? 'rgba(74,222,128,0.1)' : 'rgba(242,80,58,0.1)',
            border: `1px solid ${result.ok ? 'rgba(74,222,128,0.3)' : 'rgba(242,80,58,0.3)'}`,
            fontSize: 14,
            color: result.ok ? '#4ade80' : '#F2503A',
          }}>
            {result.message}
          </div>
        )}

        {/* Setup instructions */}
        <div style={{ marginTop: 48, padding: '24px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9EA3AE', marginBottom: 16 }}>
            Setup — required env vars
          </p>
          <pre style={{ fontSize: 12, color: '#9EA3AE', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{`LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
LINKEDIN_ORGANIZATION_ID=...  # numeric ID from your LinkedIn company page URL
NEXT_PUBLIC_SITE_URL=https://projectfitness.co

# Also add to your LinkedIn Developer App:
# Redirect URI: https://projectfitness.co/api/linkedin/callback
# Product: Marketing Developer Platform
# Scope: w_organization_social, r_organization_social

# Supabase table (run in Supabase SQL editor):
# create table linkedin_tokens (
#   id text primary key,
#   access_token text not null,
#   refresh_token text,
#   expires_at timestamptz not null,
#   updated_at timestamptz default now()
# );`}</pre>
        </div>
      </div>
    </div>
  );
}
