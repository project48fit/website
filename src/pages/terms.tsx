import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="container px-6 md:px-8 pt-32 pb-24 text-sm leading-relaxed text-white/80 space-y-6">
        <header>
          <p className="eyebrow text-brand-accent">Terms</p>
          <h1 className="h2 text-white mt-4">Terms of Service — Project Fitness</h1>
          <p>
            <strong>Effective Date:</strong> November 4, 2025
          </p>
          <p>
            <strong>Last Updated:</strong> November 4, 2025
          </p>
        </header>

        <p>
          Welcome to <strong>Project Fitness</strong> (“Project,” “we,” “our,” or “us”). These Terms of Service (“Terms”)
          govern your access to and use of our website, coaching services, and related digital materials (collectively, the “Services”).
          By accessing or using our Services, you agree to these Terms.
        </p>

        <Section title="1. Eligibility">
          You must be at least 18 years old (or the age of majority in your jurisdiction) to purchase or participate in coaching services.
        </Section>

        <Section title="2. Coaching Services">
          Project Fitness provides online fitness and nutrition coaching and educational content. All workout and meal plans are for informational
          purposes only and are not a substitute for professional medical advice. Consult your physician before starting any program.
        </Section>

        <Section title="3. Payments and Billing">
          Payments are processed securely through third-party providers (e.g., Stripe). By purchasing a package, you authorize recurring payments until canceled.
          You may cancel anytime before the next billing cycle. No partial refunds are issued for unused time.
        </Section>

        <Section title="4. Account Responsibilities">
          You’re responsible for maintaining your account credentials and all activity under your account. Notify us immediately if you suspect unauthorized use.
        </Section>

        <Section title="5. Intellectual Property">
          All content, logos, videos, and materials are owned or licensed by Project Fitness. You may not reproduce or distribute them without written consent.
        </Section>

        <Section title="6. Health Disclaimer">
          You acknowledge that exercise involves risk of injury and participation is voluntary. You assume full responsibility for any risk or injury resulting from participation.
        </Section>

        <Section title="7. Results Disclaimer">
          Results vary by individual and depend on effort and adherence. Project Fitness does not guarantee specific outcomes.
        </Section>

        <Section title="8. Termination">
          We may suspend or terminate your access to the Services at any time for violation of these Terms or for conduct that harms other members or Project.
        </Section>

        <Section title="9. Limitation of Liability">
          To the fullest extent permitted by law, Project Fitness is not liable for indirect, incidental, or consequential damages arising from use of the Services.
        </Section>

        <Section title="10. Governing Law">
          These Terms are governed by the laws of the State of California, without regard to conflict of law principles.
        </Section>

        <Section title="11. Changes to Terms">
          We may update these Terms periodically. The “Last Updated” date reflects the most recent revision. Continued use of the Services constitutes acceptance of the updated Terms.
        </Section>

        <Section title="12. Contact Us">
          Project Fitness
          <br />
          Email: <strong>support@projectfitness.co</strong>
          <br />
          Website: <strong>https://projectfitness.co</strong>
        </Section>
      </main>
      <Footer />
    </>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
