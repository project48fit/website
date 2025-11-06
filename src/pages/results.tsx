import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Results from '../components/Results';

export default function ResultsPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-8 pt-32">
        <Results />
      </main>
      <Footer />
    </>
  );
}
