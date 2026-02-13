import type { ReactNode } from 'react';
import PageLayout from '../components/PageLayout';

export default function Terms() {
  return (
    <PageLayout
      withDefaultPadding={false}
      mainClassName="container px-6 md:px-8 pt-32 pb-24 text-sm leading-relaxed text-white/80 space-y-6"
    >
      <header>
        <p className="eyebrow text-brand-accent">Terms</p>
        <h1 className="h2 text-white mt-4">Terms of Service — Project Fitness</h1>
        <p>
          <strong>Last Updated:</strong> February 13, 2026
        </p>
      </header>

      <Section title="Not Medical Advice">
        Project Fitness coaching is for educational purposes and is not a substitute for medical
        advice. Consult a qualified healthcare professional before starting any fitness or nutrition
        program.
      </Section>

      <Section title="Coaching Disclaimer">
        Results vary by individual and depend on effort, consistency, and adherence. We do not
        guarantee specific outcomes.
      </Section>

      <Section title="Communication Expectations">
        We communicate primarily by email and scheduled calls. Response times may vary based on
        workload and availability.
      </Section>

      <Section title="Scheduling and Booking">
        Consult calls are scheduled through our booking link. Availability is limited and may change
        based on coach capacity.
      </Section>

      <Section title="Acceptable Use">
        You agree to provide accurate information and to use the site and services in a respectful
        manner. Misuse, harassment, or abusive behavior may result in refusal of service.
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
