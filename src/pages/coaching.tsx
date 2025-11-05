import Navbar from '../components/Navbar';
import Coaching from '../components/Coaching';

export default function CoachingPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-32">
        <Coaching />
      </div>
    </main>
  );
}
