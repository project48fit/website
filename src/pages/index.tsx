import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Coaching from '../components/Coaching';
import Resources from '../components/Resources';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-8">
        <Hero />
        <About />
        <Coaching />
        <Resources />
      </main>
      <Footer />
    </>
  );
}
