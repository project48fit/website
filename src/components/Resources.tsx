import NewsletterForm from './NewsletterForm';
import { motion } from 'framer-motion';

export default function Resources() {
  return (
    <motion.section
      className="section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
      }}
    >
      <div className="section-header flex-col lg:flex-row">
        <div>
          <p className="eyebrow">Resources</p>
          <h2 className="h2 text-white mt-4">Stay sharp between sessions.</h2>
        </div>
        <p className="p lg:max-w-md mt-6 lg:mt-0">
          Weekly insight on training, recovery, and performance — written for high-output professionals.
        </p>
      </div>
      <div className="mt-12 max-w-xl">
        <div className="card border border-white/[0.12] bg-brand-surface/60 p-8">
          <h3 className="text-white text-xl font-semibold">The project. Newsletter</h3>
          <p className="text-sm text-brand-muted mt-4">
            Practical content on training, nutrition, and executive performance — delivered weekly.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </motion.section>
  );
}
