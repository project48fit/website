import { ChangeEvent, FormEvent, useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ApplyForm() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    goals: '',
    company_website: ''
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: 'name' | 'email' | 'goals' | 'company_website') => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setFormValues({ name: '', email: '', goals: '', company_website: '' });
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
      <input
        type="text"
        name="company_website"
        value={formValues.company_website}
        onChange={updateField('company_website')}
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
      />
      <label className="form-label">
        Full Name
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={updateField('name')}
          placeholder="First & Last"
          required
          className="form-input"
        />
      </label>

      <label className="form-label">
        Email
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={updateField('email')}
          placeholder="you@email.com"
          required
          className="form-input"
        />
      </label>

      <label className="form-label">
        Tell us about your goals
        <textarea
          name="goals"
          value={formValues.goals}
          onChange={updateField('goals')}
          placeholder="Training history, timeline, priorities..."
          rows={4}
          required
          className="form-input"
        />
      </label>

      <button
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>

      <p className="text-xs text-white/50">
        By submitting, you agree to be contacted by email/text. Please don’t include medical info.{' '}
        <a href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </a>{' '}
        •{' '}
        <a href="/terms" className="underline underline-offset-4">
          Terms
        </a>
      </p>

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
