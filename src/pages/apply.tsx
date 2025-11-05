import Navbar from '../components/Navbar';
import ApplyForm from '../components/ApplyForm';

export default function ApplyPage() {
  return (
    <main>
      <Navbar />
      <div className="container pt-32 pb-24">
        <p className="eyebrow text-brand-accent">Apply</p>
        <h1 className="h2 text-white mt-4 max-w-2xl">Let&apos;s build your coaching roadmap.</h1>
        <p className="p max-w-xl mt-6">
          Fill out the application and we&apos;ll follow up within 24 hours with next steps, availability, and program outline.
        </p>
        <div className="mt-12">
          <ApplyForm />
        </div>
      </div>
    </main>
  );
}
