import { ChangeEvent, FormEvent, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Unable to subscribe. Please try again.');
      }

      setStatus('success');
      setEmail('');
      setMessage('You are subscribed. Watch your inbox for updates.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to subscribe.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="email"
        name="email"
        placeholder="you@email.com"
        value={email}
        onChange={handleChange}
        required
        className="w-full rounded-full border border-white/15 bg-black/30 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-brand-accent focus:outline-none focus:ring-0"
      />
      <button
        type="submit"
        className="btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting…' : 'Join Newsletter'}
      </button>
      {status !== 'idle' && (
        <p className={`text-xs uppercase tracking-[0.25em] ${status === 'success' ? 'text-brand-accent' : 'text-red-400'} sm:ml-4 sm:mt-0`}>
          {message}
        </p>
      )}
    </form>
  );
}
