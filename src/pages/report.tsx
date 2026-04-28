
import { useState } from 'react';
import PageLayout from '../components/PageLayout';

type StripeData = {
  mrr: number;
  totalRev: number;
  failedPayments: number;
  churnedCount: number;
  activeSubscriptions: number;
};

function nextFirstMonday(): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  const dow = d.getDay();
  const shift = dow === 0 ? 1 : dow === 1 ? 0 : 8 - dow;
  d.setDate(d.getDate() + shift);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function fmtMoney(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function ReportPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [proxyUrl, setProxyUrl] = useState('/api/stripe');
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [fetchError, setFetchError] = useState('');
  const [stripeData, setStripeData] = useState<StripeData | null>(null);

  const [recipients, setRecipients] = useState('coach@projectfitness.co');
  const [sendStatus, setSendStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [sendError, setSendError] = useState('');

  async function fetchStripe() {
    setFetchStatus('loading');
    setFetchError('');
    try {
      const res = await fetch(proxyUrl);
      const data = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Request failed');
      setStripeData(data as StripeData);
      setFetchStatus('idle');
      setStep(2);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Unknown error');
      setFetchStatus('error');
    }
  }

  async function handleSend() {
    if (!stripeData) return;
    setSendStatus('loading');
    setSendError('');

    const now = new Date();
    const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const subject = `Project. Monthly Financial Report — ${month}`;

    const lines = [
      `MONTHLY FINANCIAL REPORT — ${month}`,
      '',
      `MRR: ${fmtMoney(stripeData.mrr)}`,
      `Total Revenue: ${fmtMoney(stripeData.totalRev)}`,
      `Active Subscriptions: ${stripeData.activeSubscriptions}`,
      `Churn: ${stripeData.churnedCount} canceled last month`,
      `Failed Payments: ${stripeData.failedPayments}`
    ];

    const emails = recipients.split(',').map(e => e.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients: emails, subject, text: lines.join('\n') })
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Send failed');
      setSendStatus('sent');
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Unknown error');
      setSendStatus('error');
    }
  }

  const scheduledSend = nextFirstMonday();

  return (
    <PageLayout withDefaultPadding={false} mainClassName="container px-6 md:px-8 pt-32 pb-24">
      <div className="max-w-3xl space-y-10">

        <div>
          <p className="eyebrow text-brand-accent">Admin</p>
          <h1 className="h2 text-white mt-4">Monthly Financial Report</h1>
          <p className="p mt-4">Pull Stripe data, then review and send.</p>
          <div className="flex items-center gap-4 mt-6">
            {([1, 2] as const).map(n => (
              <div key={n} className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                    step > n
                      ? 'border-brand-accent bg-brand-accent text-[#050506]'
                      : step === n
                      ? 'border-brand-accent text-brand-accent bg-brand-accent/10'
                      : 'border-white/20 text-white/30'
                  }`}
                >
                  {step > n ? '✓' : n}
                </span>
                <span className={`text-xs uppercase tracking-[0.2em] ${step >= n ? 'text-brand-accent' : 'text-white/30'}`}>
                  {n === 1 ? 'Stripe' : 'Send'}
                </span>
                {n < 2 && <span className="text-white/20 ml-2">—</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1 — Connect Stripe */}
        {step === 1 && (
          <div className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
            <p className="eyebrow text-white/70">Step 1 — Connect Stripe</p>
            <label className="form-label">
              Proxy URL
              <input
                type="text"
                value={proxyUrl}
                onChange={e => setProxyUrl(e.target.value)}
                className="form-input"
              />
            </label>
            <button
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={fetchStripe}
              disabled={fetchStatus === 'loading'}
            >
              {fetchStatus === 'loading' ? 'Fetching…' : 'Fetch Stripe Data'}
            </button>
            {fetchStatus === 'error' && (
              <p className="text-sm uppercase tracking-[0.2em] text-red-400">{fetchError}</p>
            )}
          </div>
        )}

        {/* Step 2 — Review & Send */}
        {step === 2 && stripeData && (
          <div className="space-y-6">
            <div className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
              <p className="eyebrow text-white/70">Step 2 — Review Report</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard label="MRR" value={fmtMoney(stripeData.mrr)} />
                <MetricCard label="Total Revenue" value={fmtMoney(stripeData.totalRev)} />
                <MetricCard label="Active Subscriptions" value={String(stripeData.activeSubscriptions)} />
                <MetricCard label="Churn" value={`${stripeData.churnedCount} canceled`} />
                <MetricCard label="Failed Payments" value={String(stripeData.failedPayments)} />
              </div>
            </div>

            <div className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
              <p className="eyebrow text-white/70">Send Report</p>
              <label className="form-label">
                Recipients
                <input
                  type="text"
                  value={recipients}
                  onChange={e => setRecipients(e.target.value)}
                  placeholder="coach@projectfitness.co, caleb@projectfitness.co"
                  className="form-input"
                />
              </label>
              <div className="flex items-center gap-4">
                <button
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSend}
                  disabled={sendStatus === 'loading' || sendStatus === 'sent'}
                >
                  {sendStatus === 'loading' ? 'Sending…' : sendStatus === 'sent' ? 'Sent' : 'Send Report'}
                </button>
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  Back
                </button>
              </div>
              {sendStatus === 'sent' && (
                <p className="text-sm uppercase tracking-[0.2em] text-brand-accent">
                  Report sent successfully.
                </p>
              )}
              {sendStatus === 'error' && (
                <p className="text-sm uppercase tracking-[0.2em] text-red-400">{sendError}</p>
              )}
              <p className="text-xs text-white/30 uppercase tracking-[0.15em]">
                Next scheduled send: {scheduledSend}
              </p>
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
