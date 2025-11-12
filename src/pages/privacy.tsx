import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="container px-6 md:px-8 pt-32 pb-24 text-sm leading-relaxed text-white/80 space-y-6">
        <header>
          <p className="eyebrow text-brand-accent">Privacy</p>
          <h1 className="h2 text-white mt-4">Privacy Policy — Project Fitness</h1>
          <p>
            <strong>Effective Date:</strong> November 4, 2025
          </p>
          <p>
            <strong>Last Updated:</strong> November 4, 2025
          </p>
        </header>

        <p>
          This Privacy Policy explains how <strong>Project Fitness</strong> (“Project,” “we,” “our,” or “us”) collects, uses, and protects your information
          when you visit our website, sign up for coaching, or subscribe to our newsletter.
        </p>

        <Section title="1. Information We Collect">
          <ul className="list-disc ml-6 space-y-1">
            <li>Personal Information: name, email, billing details</li>
            <li>Fitness Data: information you voluntarily share</li>
            <li>Technical Information: IP address, browser type, device data, and cookies</li>
          </ul>
        </Section>

        <Section title="2. How We Use Information">
          <ul className="list-disc ml-6 space-y-1">
            <li>Deliver coaching and nutrition services</li>
            <li>Process payments and send invoices</li>
            <li>Send updates, newsletters, and promotional materials (with opt-out)</li>
            <li>Improve site performance and client experience</li>
          </ul>
        </Section>

        <Section title="3. Sharing of Information">
          We do not sell your data. We may share information with trusted service providers (payment processors, email platforms) who assist in delivering the Services.
        </Section>

        <Section title="4. Data Security">
          We implement industry-standard safeguards to protect your information. However, no transmission over the internet is 100% secure, and you share data at your own risk.
        </Section>

        <Section title="5. Data Retention">
          We retain personal information as long as necessary to deliver coaching, comply with legal obligations, and resolve disputes.
        </Section>

        <Section title="6. Your Rights">
          Depending on your location, you may request access, correction, or deletion of your personal information. Contact us at support@projectfitness.co to start the process.
        </Section>

        <Section title="7. Cookies">
          We use cookies and similar technologies for analytics and performance. You can adjust cookie preferences through your browser settings.
        </Section>

        <Section title="8. Third-Party Links">
          Our website may contain links to external sites. We’re not responsible for the privacy practices of those sites and encourage you to review their policies.
        </Section>

        <Section title="9. Newsletter and Marketing">
          By subscribing, you consent to receive marketing emails. You can unsubscribe at any time using the link in each message or by contacting us directly.
        </Section>

        <Section title="10. Children’s Privacy">
          Our Services are not directed toward children under 16, and we do not knowingly collect data from minors.
        </Section>

        <Section title="11. Updates">
          We may update this Privacy Policy periodically. The “Last Updated” date reflects the most recent revision. Continued use of our Services indicates acceptance of any updates.
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
