import type { ReactNode } from 'react';
import PageLayout from '../components/PageLayout';

export default function PrivacyPolicy() {
  return (
    <PageLayout
      withDefaultPadding={false}
      mainClassName="container px-6 md:px-8 pt-32 pb-24 text-sm leading-relaxed text-white/80 space-y-6"
    >
      <header>
        <p className="eyebrow text-brand-accent">Privacy</p>
        <h1 className="h2 text-white mt-4">Privacy Policy — Project Fitness</h1>
        <p>
          <strong>Last Updated:</strong> February 13, 2026
        </p>
      </header>

      <p>
        This notice explains how Project Fitness collects and uses information submitted through our
        coaching application. Please do not submit medical information through the form.
      </p>

      <Section title="Information We Collect">
        <ul className="list-disc ml-6 space-y-1">
          <li>Name, email, and phone number</li>
          <li>Primary goal, training availability, and goals detail</li>
          <li>Marketing attribution data (UTM parameters and referrer)</li>
          <li>Landing page URL at the time of submission</li>
        </ul>
      </Section>

      <Section title="How We Use Your Information">
        <ul className="list-disc ml-6 space-y-1">
          <li>Review and respond to coaching applications</li>
          <li>Schedule consult calls and deliver coaching services</li>
          <li>Measure campaign performance and improve our marketing</li>
        </ul>
      </Section>

      <Section title="Who We Share With">
        We use third-party providers to operate the site and deliver email notifications, including
        Supabase (data storage), Resend (email delivery), and Vercel (hosting).
      </Section>

      <Section title="Retention">
        We retain lead data for 12 months unless you request deletion.
      </Section>

      <Section title="Deletion Requests">
        To request deletion of your information, email{' '}
        <strong>coach@projectfitness.co</strong>.
      </Section>
    </PageLayout>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
