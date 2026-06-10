import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from '../../components/PageLayout';

type DraftResponse = {
  subject: string;
  body: string;
};

type PendingResponse = {
  status: 'pending';
  run_id: string;
};

export default function FollowupAdminPage() {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [goals, setGoals] = useState('');
  const [notes, setNotes] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const pollCount = useRef(0);
  const pollTimer = useRef<NodeJS.Timeout | null>(null);

  const [bookedEmail, setBookedEmail] = useState('');
  const [bookedStatus, setBookedStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');
  const [bookedMessage, setBookedMessage] = useState('');

  const handleMarkBooked = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookedStatus('loading');
    setBookedMessage('');
    try {
      const res = await fetch('/api/admin/mark-booked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
        body: JSON.stringify({ email: bookedEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBookedStatus('error');
        setBookedMessage((data as { error?: string })?.error ?? 'Something went wrong.');
        return;
      }
      if ((data as { already_booked?: boolean }).already_booked) {
        setBookedStatus('already');
        setBookedMessage('Already marked as booked.');
        return;
      }
      setBookedStatus('success');
      setBookedMessage('Marked as booked. Nurture emails cancelled.');
      setBookedEmail('');
    } catch {
      setBookedStatus('error');
      setBookedMessage('Request failed. Check connection.');
    }
  };

  const requestDraft = useCallback(async (payload: Record<string, unknown>) => {
    const response = await fetch('/api/parallel/followup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-admin-token': token } : {})
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 202) {
      const pending = data as PendingResponse;
      setRunId(pending.run_id);
      setStatus('loading');
      setMessage('Draft is processing. Retrying…');
      return;
    }

    if (!response.ok) {
      throw new Error((data as { error?: string })?.error ?? 'Unable to generate draft.');
    }

    const draft = data as DraftResponse;
    setSubject(draft.subject);
    setBody(draft.body);
    setStatus('success');
    setMessage('Draft generated. You can edit it below.');
    setRunId(null);
    pollCount.current = 0;
  }, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    setRunId(null);
    pollCount.current = 0;

    try {
      await requestDraft({ name, email, goals, notes });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to generate draft.');
    }
  };

  useEffect(() => {
    if (!runId) return;

    pollTimer.current = setTimeout(async () => {
      if (pollCount.current >= 8) {
        setStatus('error');
        setMessage('Draft is taking too long. Please try again.');
        setRunId(null);
        return;
      }

      pollCount.current += 1;
      try {
        await requestDraft({ run_id: runId });
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unable to generate draft.');
        setRunId(null);
      }
    }, 1500);

    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [runId, requestDraft]);

  return (
    <PageLayout withDefaultPadding={false} mainClassName="container px-6 md:px-8 pt-32 pb-24">
      <div className="max-w-3xl space-y-10">
        <div>
          <p className="eyebrow text-brand-accent">Admin</p>
          <h1 className="h2 text-white mt-4">Follow-up Draft Generator</h1>
          <p className="p mt-4">
            Generate a follow-up email draft with Parallel, then edit it before sending.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
          <label className="form-label">
            Admin Token (optional if configured)
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="ADMIN_API_TOKEN"
              className="form-input"
            />
          </label>
          <label className="form-label">
            Applicant Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="First & Last"
              required
              className="form-input"
            />
          </label>
          <label className="form-label">
            Applicant Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              required
              className="form-input"
            />
          </label>
          <label className="form-label">
            Goals
            <textarea
              value={goals}
              onChange={(event) => setGoals(event.target.value)}
              placeholder="Goals, timeline, context..."
              rows={4}
              required
              className="form-input"
            />
          </label>
          <label className="form-label">
            Internal Notes (optional)
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Observations, constraints, availability..."
              rows={3}
              className="form-input"
            />
          </label>

          <button
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Generating…' : 'Generate Draft'}
          </button>

          {message && (
            <p className={`text-sm uppercase tracking-[0.2em] ${status === 'error' ? 'text-red-400' : 'text-brand-accent'}`}>
              {message}
            </p>
          )}
        </form>

        <form onSubmit={handleMarkBooked} className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
          <div>
            <p className="eyebrow text-brand-accent">Booking</p>
            <h2 className="h3 text-white mt-2">Mark as Booked</h2>
            <p className="p mt-2">
              When a lead books a call, enter their email to stop the nurture sequence and log the booking.
            </p>
          </div>

          <label className="form-label">
            Lead Email
            <input
              type="email"
              value={bookedEmail}
              onChange={(e) => setBookedEmail(e.target.value)}
              placeholder="lead@email.com"
              required
              className="form-input"
            />
          </label>

          <button
            type="submit"
            disabled={bookedStatus === 'loading'}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {bookedStatus === 'loading' ? 'Marking…' : 'Mark as Booked'}
          </button>

          {bookedMessage && (
            <p className={`text-sm uppercase tracking-[0.2em] ${
              bookedStatus === 'error' ? 'text-red-400' :
              bookedStatus === 'already' ? 'text-white/50' :
              'text-brand-accent'
            }`}>
              {bookedMessage}
            </p>
          )}
        </form>

        <div className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6">
          <div>
            <p className="eyebrow text-white/70">Draft</p>
            <p className="p mt-2">Edit the subject and body before sending.</p>
          </div>

          <label className="form-label">
            Subject
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Email subject"
              className="form-input"
            />
          </label>

          <label className="form-label">
            Body
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Email body"
              rows={10}
              className="form-input"
            />
          </label>
        </div>
      </div>
    </PageLayout>
  );
}
