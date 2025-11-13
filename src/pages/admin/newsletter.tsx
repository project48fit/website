import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function NewsletterDraftPage() {
  const [highlights, setHighlights] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/newsletter-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlights })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? 'Unable to generate draft.');
      }

      const data = await res.json();
      setDraft(data.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container px-6 md:px-8 pt-32 pb-24 space-y-6">
        <p className="eyebrow text-brand-accent">Admin</p>
        <h1 className="h2 text-white">Newsletter Draft Generator</h1>
        <form className="space-y-4" onSubmit={handleGenerate}>
          <textarea
            className="w-full rounded-2xl border border-white/15 bg-black/40 p-4 text-white"
            rows={6}
            placeholder="Bullet points, wins, announcements..."
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Drafting…' : 'Generate Draft'}
          </button>
        </form>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {draft && (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-white/80 whitespace-pre-line">
            {draft}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
