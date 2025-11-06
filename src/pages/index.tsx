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
      <main>
        <Hero />
        <About />
        <Coaching />
        <Resources />
      </main>
      <Footer />
    </>
  );
}
