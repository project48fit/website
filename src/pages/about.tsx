import Navbar from '../components/Navbar';
import About from '../components/About';

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-32">
        <About />
      </div>
    </main>
  );
}
