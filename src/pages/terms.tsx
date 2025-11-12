import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-8 pt-32 pb-24 space-y-6">
        <p className="eyebrow text-brand-accent">Terms</p>
        <h1 className="h2 text-white">Terms of Service</h1>
        <p className="p text-white/80">
          Use this page to describe your client agreement, payment terms, cancellation policy, and disclaimers regarding coaching advice. Replace this placeholder with your legal copy.
        </p>
      </main>
      <Footer />
    </>
  );
}
