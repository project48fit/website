import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Coaching from '../components/Coaching';
import Resources from '../components/Resources';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Coaching />
      <Resources />
    </main>
  );
}
