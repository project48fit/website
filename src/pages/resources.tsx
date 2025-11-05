import Navbar from '../components/Navbar';
import Resources from '../components/Resources';

export default function ResourcesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-32">
        <Resources />
      </div>
    </main>
  );
}
