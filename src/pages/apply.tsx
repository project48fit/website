import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ApplyForm from '../components/ApplyForm';

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className="container px-6 md:px-8 pt-32 pb-24">
        <p className="eyebrow text-brand-accent">Apply</p>
        <h1 className="h2 text-white mt-4 max-w-2xl">Let&apos;s build your coaching roadmap.</h1>
        <p className="p max-w-xl mt-6">
          Fill out the application and we&apos;ll follow up within 24 hours with next steps, availability, and program outline.
        </p>
        <div className="mt-12">
          <ApplyForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
