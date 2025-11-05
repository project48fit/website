import { ChangeEvent, FormEvent, useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ApplyForm() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    goals: ''
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: 'name' | 'email' | 'goals') => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setFormValues({ name: '', email: '', goals: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit application right now.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card border border-white/10 bg-brand-surface/80 p-8 space-y-6 max-w-xl"
    >
      <label className="block text-sm text-white/80 uppercase tracking-[0.25em]">
        Full Name
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={updateField('name')}
          placeholder="First & Last"
          required
          className="mt-3 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-brand-accent focus:outline-none focus:ring-0"
        />
      </label>

      <label className="block text-sm text-white/80 uppercase tracking-[0.25em]">
        Email
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={updateField('email')}
          placeholder="you@email.com"
          required
          className="mt-3 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-brand-accent focus:outline-none focus:ring-0"
        />
      </label>

      <label className="block text-sm text-white/80 uppercase tracking-[0.25em]">
        Tell us about your goals
        <textarea
          name="goals"
          value={formValues.goals}
          onChange={updateField('goals')}
          placeholder="Training history, timeline, priorities..."
          rows={4}
          required
          className="mt-3 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-brand-accent focus:outline-none focus:ring-0"
        />
      </label>

      <button
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>

      {status === 'success' && (
        <p className="text-sm text-brand-accent uppercase tracking-[0.25em]">
          Application received — we&apos;ll reach out within 24 hours.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
    </form>
  );
}
