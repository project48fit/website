import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Coaching from '../components/Coaching';

export default function CoachingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <Coaching />
      </main>
      <Footer />
    </>
  );
}
