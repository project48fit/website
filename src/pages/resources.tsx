import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Resources from '../components/Resources';

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-8 pt-32">
        <Resources />
      </main>
      <Footer />
    </>
  );
}
