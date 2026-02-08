import PageLayout from '../components/PageLayout';
import Hero from '../components/Hero';
import About from '../components/About';
import Coaching from '../components/Coaching';
import Resources from '../components/Resources';

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <About />
      <Coaching />
      <Resources />
    </PageLayout>
  );
}
