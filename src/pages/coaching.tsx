import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Coaching from '../components/Coaching';

export default function CoachingPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-8 pt-32">
        <Coaching />
      </main>
      <Footer />
    </>
  );
}
