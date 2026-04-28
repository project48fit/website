
import { ChangeEvent, DragEvent, useState } from 'react';
import PageLayout from '../components/PageLayout';

type StripeData = {
  mrr: number;
  totalRev: number;
  failedPayments: number;
  churnedCount: number;
  activeSubscriptions: number;
};

type TrainerizeData = {
  activeClients: number;
  workoutsCompleted: number | null;
  tierBreakdown: Record<string, number> | null;
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

function findColumn(headers: string[], candidates: string[]): string | null {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.findIndex(h => h.includes(c.toLowerCase()));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function parseTrainerize(rows: Record<string, string>[]): TrainerizeData {
  if (!rows.length) return { activeClients: 0, workoutsCompleted: null, tierBreakdown: null };
  const headers = Object.keys(rows[0]);
  const statusCol = findColumn(headers, ['status', 'client status']);
  const workoutsCol = findColumn(headers, ['workouts completed', 'sessions completed', 'total workouts', 'workouts']);
  const tierCol = findColumn(headers, ['plan', 'program', 'package', 'tier', 'subscription']);

  let activeClients = 0;
  let totalWorkouts = 0;
  const tierCounts: Record<string, number> = {};

  for (const row of rows) {
    const rawStatus = statusCol ? (row[statusCol] ?? '').toLowerCase().trim() : '';
    const isActive = statusCol
      ? rawStatus.startsWith('active') || rawStatus === 'active'
      : true;

    if (isActive) {
      activeClients++;
      if (workoutsCol) {
        const n = parseInt(row[workoutsCol] ?? '0', 10);
        if (!isNaN(n)) totalWorkouts += n;
      }
      if (tierCol) {
        const tier = (row[tierCol] ?? '').trim() || 'Unknown';
        tierCounts[tier] = (tierCounts[tier] ?? 0) + 1;
      }
    }
  }

  return {
    activeClients,
    workoutsCompleted: workoutsCol ? totalWorkouts : null,
    tierBreakdown: tierCol && Object.keys(tierCounts).length > 0 ? tierCounts : null
  };
}

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
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [proxyUrl, setProxyUrl] = useState('/api/stripe');
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [fetchError, setFetchError] = useState('');
  const [stripeData, setStripeData] = useState<StripeData | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [csvError, setCsvError] = useState('');
  const [trainerizeData, setTrainerizeData] = useState<TrainerizeData | null>(null);

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

  function processFile(file: File) {
    setCsvError('');
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Please upload a .csv file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = (e.target?.result as string) ?? '';
        const rows = parseCSV(text);
        if (!rows.length) throw new Error('No data rows found.');
        setTrainerizeData(parseTrainerize(rows));
        setStep(3);
      } catch (err) {
        setCsvError(err instanceof Error ? err.message : 'Failed to parse CSV.');
      }
    };
    reader.readAsText(file);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  async function handleSend() {
    setSendStatus('loading');
    setSendError('');

    const now = new Date();
    const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const subject = `Project. Monthly Financial Report — ${month}`;

    const lines: string[] = [
      `MONTHLY FINANCIAL REPORT — ${month}`,
      '',
      `MRR: ${stripeData ? fmtMoney(stripeData.mrr) : 'N/A'}`,
      `Total Revenue: ${stripeData ? fmtMoney(stripeData.totalRev) : 'N/A'}`,
      `Active Subscriptions: ${stripeData?.activeSubscriptions ?? 'N/A'}`,
      `Churn: ${stripeData?.churnedCount ?? 'N/A'} canceled last month`,
      `Failed Payments: ${stripeData?.failedPayments ?? 'N/A'}`,
      `Active Clients (Trainerize): ${trainerizeData?.activeClients ?? 'N/A'}`
    ];
    if (trainerizeData?.workoutsCompleted != null) {
      lines.push(`Workouts Completed: ${trainerizeData.workoutsCompleted}`);
    }
    if (trainerizeData?.tierBreakdown) {
      lines.push('', 'Client Breakdown by Tier:');
      for (const [tier, count] of Object.entries(trainerizeData.tierBreakdown)) {
        lines.push(`  ${tier}: ${count}`);
      }
    }

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
          <p className="p mt-4">
            Pull Stripe data, upload your Trainerize export, then review and send.
          </p>
          <div className="flex items-center gap-4 mt-6">
            {([1, 2, 3] as const).map(n => (
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
                  {n === 1 ? 'Stripe' : n === 2 ? 'Trainerize' : 'Send'}
                </span>
                {n < 3 && <span className="text-white/20 ml-2">—</span>}
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

        {/* Step 2 — Upload Trainerize CSV */}
        {step === 2 && (
          <div className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
            <p className="eyebrow text-white/70">Step 2 — Upload Trainerize CSV</p>
            <p className="text-sm text-white/60">
              Export your client list from Trainerize and drop it here. Parsed entirely client-side.
            </p>

            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed p-14 text-center transition-colors ${
                isDragging ? 'border-brand-accent bg-brand-accent/5' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-white/60 text-sm uppercase tracking-[0.2em]">
                {isDragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-white/30 text-xs mt-2">.csv files only</p>
            </div>

            {csvError && (
              <p className="text-sm uppercase tracking-[0.2em] text-red-400">{csvError}</p>
            )}

            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
          </div>
        )}

        {/* Step 3 — Review & Send */}
        {step === 3 && stripeData && trainerizeData && (
          <div className="space-y-6">
            <div className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
              <p className="eyebrow text-white/70">Step 3 — Review Report</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard label="MRR" value={fmtMoney(stripeData.mrr)} />
                <MetricCard label="Total Revenue" value={fmtMoney(stripeData.totalRev)} />
                <MetricCard label="Active Clients" value={String(trainerizeData.activeClients)} />
                <MetricCard label="Churn" value={`${stripeData.churnedCount} canceled`} />
                <MetricCard label="Failed Payments" value={String(stripeData.failedPayments)} />
                <MetricCard label="Active Subscriptions" value={String(stripeData.activeSubscriptions)} />
                {trainerizeData.workoutsCompleted != null && (
                  <MetricCard label="Workouts Completed" value={String(trainerizeData.workoutsCompleted)} />
                )}
              </div>

              {trainerizeData.tierBreakdown && (
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-3">Client Breakdown by Tier</p>
                  <div className="divide-y divide-white/[0.06]">
                    {Object.entries(trainerizeData.tierBreakdown).map(([tier, count]) => (
                      <div key={tier} className="flex justify-between py-2 text-sm">
                        <span className="text-white/60">{tier}</span>
                        <span className="text-white font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <button className="btn-secondary" onClick={() => setStep(2)}>
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
