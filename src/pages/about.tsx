import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from '../components/About';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-8 pt-32">
        <About />
      </main>
      <Footer />
    </>
  );
}
