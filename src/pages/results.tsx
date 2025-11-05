import Navbar from '../components/Navbar';
import Results from '../components/Results';

export default function ResultsPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-32">
        <Results />
      </div>
    </main>
  );
}
