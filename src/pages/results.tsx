import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Results from '../components/Results';

export default function ResultsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <Results />
      </main>
      <Footer />
    </>
  );
}
