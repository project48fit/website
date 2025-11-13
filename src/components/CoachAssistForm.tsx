import { useState } from 'react';

export default function CoachAssistForm() {
  const [form, setForm] = useState({ goals: '', schedule: '', experience: '' });
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/coach-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? 'Unable to generate suggestion.');
      }

      const data = await res.json();
      setResponse(data.summary ?? 'A coach will follow up shortly.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card border border-white/15 bg-brand-surface/80 p-8 space-y-6">
      <h3 className="text-white text-xl font-semibold">AI Coach Intake</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-xs uppercase tracking-[0.3em] text-white/70">
          Your Goals
          <textarea
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-white"
            rows={3}
            value={form.goals}
            onChange={handleChange('goals')}
            placeholder="Build lean muscle, run a faster 10k, etc."
            required
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.3em] text-white/70">
          Weekly Schedule
          <input
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-white"
            value={form.schedule}
            onChange={handleChange('schedule')}
            placeholder="5am sessions, travel weekly, etc."
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.3em] text-white/70">
          Training Experience
          <input
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-white"
            value={form.experience}
            onChange={handleChange('experience')}
            placeholder="Intermediate powerlifter, beginner runner, etc."
          />
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Thinking…' : 'Get Recommendation'}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {response && (
        <div className="rounded-2xl border border-white/15 bg-black/30 p-4 text-sm text-white/80 whitespace-pre-line">
          {response}
        </div>
      )}
    </div>
  );
}
