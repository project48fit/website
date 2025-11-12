import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-8 pt-32 pb-24 space-y-6">
        <p className="eyebrow text-brand-accent">Privacy</p>
        <h1 className="h2 text-white">Privacy Policy</h1>
        <p className="p text-white/80">
          This page outlines how project. collects, stores, and uses personal data. Replace this placeholder with your actual policy, including GDPR/CCPA disclosures, data retention, and contact information.
        </p>
      </main>
      <Footer />
    </>
  );
}
