import { useEffect, useMemo, useState } from 'react';
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

  const onSubmit = async (values: LeadForm) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, ...meta })
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
    <PageLayout withDefaultPadding={false} mainClassName="px-5 pt-24 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">1:1 Online Coaching</p>
            <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
              Coaching for people who want structure, accountability, and real results.
            </h1>
            <p className="text-base text-white/70">
              Personalized training and nutrition. Weekly check-ins. No guesswork.
            </p>
            <p className="text-sm text-white/60">Apply in 2 minutes</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Who it’s for</h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Busy professionals who need a clear plan and accountability.</li>
              <li>People tired of plateaus and guessing what to do next.</li>
              <li>Anyone who wants coaching that fits real life.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">How it works</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Apply', 'Book', 'Start'].map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/50">Step {index + 1}</div>
                  <div className="mt-2 text-base font-medium text-white">{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Trusted by clients who want real change</h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Weekly check-ins that keep you consistent.</li>
              <li>Programming built around your schedule.</li>
              <li>Clear feedback and fast adjustments.</li>
            </ul>
            <p className="text-sm text-white/60">
              “I finally have a plan I can actually stick to. Progress is measurable every week.”
              <span className="block text-white/50">— Online Coaching Client</span>
            </p>
          </div>
        </div>

        <div id="application" className="w-full max-w-xl flex-1">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            {status === 'success' ? (
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Application received</p>
                <h2 className="text-2xl font-semibold text-white">Step 2: Book your consult now</h2>
                <p className="text-sm text-white/70">
                  Pick a time that works for you. We’ll cover goals, constraints, and next steps.
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                    {...register('primary_goal', { required: 'Primary goal is required.' })}
                  >
                    <option value="">Select</option>
                    <option value="Fat loss">Fat loss</option>
                    <option value="Muscle gain">Muscle gain</option>
                    <option value="Strength">Strength</option>
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
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
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
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
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
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
                    {...register('goals_detail')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Submitting…' : 'Submit application'}
                </button>

                <p className="text-xs text-white/50">
                  By submitting, you agree to be contacted by email/text. Please don’t include
                  medical info.{' '}
                  <a href="/privacy" className="underline underline-offset-4">
                    Privacy Policy
                  </a>{' '}
                  •{' '}
                  <a href="/terms" className="underline underline-offset-4">
                    Terms
                  </a>
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
