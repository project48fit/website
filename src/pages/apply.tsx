import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';

type ApplyPageProps = {
  bookingUrl: string;
};

type LeadForm = {
  full_name: string;
  email: string;
  phone: string;
  primary_goal: string;
  training_days_per_week: string;
  consult_availability: string;
  start_timeframe: string;
  goals_detail: string;
  company_website: string;
};

type LeadMetadata = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_url?: string;
};

export default function ApplyPage({ bookingUrl }: ApplyPageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [leadId, setLeadId] = useState<string | null>(null);
  const [meta, setMeta] = useState<LeadMetadata>({});
  const [liFatId, setLiFatId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LeadForm>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      primary_goal: '',
      training_days_per_week: '',
      consult_availability: '',
      start_timeframe: '',
      goals_detail: '',
      company_website: ''
    }
  });

  const queryParams = useMemo(() => router.query, [router.query]);

  useEffect(() => {
    if (!router.isReady) return;
    setMeta({
      utm_source: typeof queryParams.utm_source === 'string' ? queryParams.utm_source : undefined,
      utm_medium: typeof queryParams.utm_medium === 'string' ? queryParams.utm_medium : undefined,
      utm_campaign: typeof queryParams.utm_campaign === 'string' ? queryParams.utm_campaign : undefined,
      utm_content: typeof queryParams.utm_content === 'string' ? queryParams.utm_content : undefined,
      utm_term: typeof queryParams.utm_term === 'string' ? queryParams.utm_term : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      landing_url: typeof window !== 'undefined' ? window.location.href : undefined
    });
  }, [router.isReady, queryParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('li_fat_id') ?? '';
    if (fromUrl) {
      localStorage.setItem('li_fat_id', fromUrl);
      setLiFatId(fromUrl);
      return;
    }
    const stored = localStorage.getItem('li_fat_id') ?? '';
    if (stored) setLiFatId(stored);
  }, []);

  const onSubmit = async (values: LeadForm) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const storedLiFatId =
        liFatId ||
        (typeof window !== 'undefined' ? localStorage.getItem('li_fat_id') : '') ||
        '';
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, ...meta, li_fat_id: storedLiFatId })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? 'Unable to submit application.');
      }

      const data = await response.json();
      setLeadId(data?.lead_id ?? null);
      setStatus('success');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('apply_submit_success'));
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit application.');
    }
  };

  const handleBookingClick = async () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('apply_booking_click'));
    }

    if (!leadId) return;

    await fetch('/api/booking-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId })
    });
  };

  return (
    <PageLayout withDefaultPadding={false} mainClassName="px-5 pt-28 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:gap-20">
        <div className="flex-1 space-y-10">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">1:1 Executive Coaching</p>
            <h1 className="text-3xl font-semibold leading-[1.1] text-white md:text-[2.5rem] tracking-[-0.01em]">
              Structure, accountability, and measurable performance — built around your life.
            </h1>
            <p className="text-base text-white/60 leading-relaxed">
              Personalized training and nutrition built around your schedule. Weekly check-ins. Direct coach access. Apply in 2 minutes.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Who it's for</p>
            <ul className="space-y-3">
              {[
                'Executives and founders who need a structured system, not a generic plan.',
                'Leaders whose physical output isn\'t keeping pace with professional demands.',
                'Professionals who treat health as a performance asset and want expert accountability.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                  <span className="mt-[7px] h-1 w-1 rounded-full bg-brand-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">What to expect</p>
            <ul className="space-y-3">
              {[
                'Weekly check-ins that keep you consistent regardless of your schedule.',
                'Programming adapted to your travel, goals, and recovery.',
                'Fast feedback from a coach who knows your program inside out.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                  <span className="mt-[7px] h-1 w-1 rounded-full bg-brand-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/40 italic border-l border-white/10 pl-4">
            "The accountability and commitment that comes with investing in Project is the difference maker."
            <span className="block not-italic text-white/30 mt-1">— Keith T., Executive Coaching Client</span>
          </p>
        </div>

        <div id="application" className="w-full max-w-xl flex-1">
          {/* Step progress indicator */}
          <div className="mb-6 flex items-center">
            {[{ n: 1, label: 'Apply' }, { n: 2, label: 'Book' }, { n: 3, label: 'Start' }].map(({ n, label }, i) => (
              <div key={n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-[0.6rem] font-semibold border transition-colors ${
                      (n === 1 && status !== 'success') || (n === 2 && status === 'success')
                        ? 'bg-brand-accent border-brand-accent text-black'
                        : 'bg-transparent border-white/20 text-white/35'
                    }`}
                  >
                    {n}
                  </div>
                  <span className={`mt-1.5 text-[0.6rem] uppercase tracking-[0.2em] ${
                    (n === 1 && status !== 'success') || (n === 2 && status === 'success')
                      ? 'text-brand-accent'
                      : 'text-white/30'
                  }`}>{label}</span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-px mx-3 mb-4 ${
                    (n === 1 && status === 'success') ? 'bg-brand-accent/40' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 md:p-8">
            {status === 'success' ? (
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Application received</p>
                <h2 className="text-2xl font-semibold text-white">Step 2: Book your consult now</h2>
                <p className="text-sm text-white/70">
                  Pick a time that works for you. We'll cover goals, constraints, and next steps.
                </p>
                <a
                  href={bookingUrl}
                  onClick={handleBookingClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black"
                >
                  Book your consult
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <h2 className="text-xl font-semibold text-white">Apply now</h2>

                <input
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                  className="hidden"
                  {...register('company_website')}
                />

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                    Full name
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                    {...register('full_name', { required: 'Full name is required.' })}
                  />
                  {errors.full_name && (
                    <p className="mt-2 text-xs text-red-400">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                    {...register('email', { required: 'Email is required.' })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                    {...register('phone', { required: 'Phone is required.' })}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                    Primary goal
                  </label>
                  <select
                    className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                    {...register('primary_goal', { required: 'Primary goal is required.' })}
                  >
                    <option value="">Select</option>
                    <option value="Body composition">Body composition</option>
                    <option value="Muscle gain">Muscle gain</option>
                    <option value="Strength">Strength</option>
                    <option value="Energy & performance">Energy &amp; performance</option>
                    <option value="Overall health">Overall health</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.primary_goal && (
                    <p className="mt-2 text-xs text-red-400">{errors.primary_goal.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                      Training days / week
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                      {...register('training_days_per_week', {
                        required: 'Training days are required.'
                      })}
                    >
                      <option value="">Select</option>
                      <option value="2–3">2–3</option>
                      <option value="3–4">3–4</option>
                      <option value="5+">5+</option>
                    </select>
                    {errors.training_days_per_week && (
                      <p className="mt-2 text-xs text-red-400">
                        {errors.training_days_per_week.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                      Consult availability
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                      {...register('consult_availability', {
                        required: 'Availability is required.'
                      })}
                    >
                      <option value="">Select</option>
                      <option value="Mornings">Mornings</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Evenings">Evenings</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                    {errors.consult_availability && (
                      <p className="mt-2 text-xs text-red-400">
                        {errors.consult_availability.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                    Start timeframe
                  </label>
                  <select
                    className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                    {...register('start_timeframe', { required: 'Start timeframe is required.' })}
                  >
                    <option value="">Select</option>
                    <option value="ASAP">ASAP</option>
                    <option value="2–4 weeks">2–4 weeks</option>
                    <option value="1–2 months">1–2 months</option>
                  </select>
                  {errors.start_timeframe && (
                    <p className="mt-2 text-xs text-red-400">{errors.start_timeframe.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.3em] text-white/60">
                    Goals detail (optional)
                  </label>
                  <textarea
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/[0.12] bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                    {...register('goals_detail')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Submitting…' : 'Submit application'}
                </button>

                <p className="text-center text-xs text-white/40 tracking-wide">
                  Free consultation — no commitment required.
                </p>

                <p className="text-xs text-white/40">
                  By submitting, you agree to be contacted by email/text. Please don't include
                  medical info.{' '}
                  <Link href="/privacy">
                    Privacy Policy
                  </Link>{' '}
                  •{' '}
                  <Link href="/terms">
                    Terms
                  </Link>
                </p>

                {status === 'error' && (
                  <p className="text-xs text-red-400">{errorMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ApplyPageProps> = async () => {
  return {
    props: {
      bookingUrl: process.env.BOOKING_URL ?? 'https://calendar.app.google/c7qR2kRWT7HLDQBYA'
    }
  };
};
