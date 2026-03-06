import NewsletterForm from './NewsletterForm';
import { motion } from 'framer-motion';
import { fadeInScale } from '../lib/motion';

export default function Resources() {
  return (
    <motion.section
      className="section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } }
      }}
    >
      <div className="section-header flex-col lg:flex-row">
        <div>
          <p className="eyebrow">Resources</p>
          <h2 className="h2 text-white mt-4">Build the foundation before you apply.</h2>
        </div>
        <p className="p lg:max-w-md mt-6 lg:mt-0">
          Practical content on training, nutrition, and performance for executives who want to move with intention.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div
          className="card border border-white/12 bg-brand-surface/60 p-8 flex flex-col justify-between tilt-card"
          variants={fadeInScale}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
        >
          <div>
            <h3 className="text-white text-xl font-semibold">The project. Newsletter</h3>
            <p className="text-sm text-brand-muted mt-4">
              Weekly insight on training, recovery, and performance for high-output professionals.
            </p>
          </div>
          <NewsletterForm />
        </motion.div>
        <motion.div
          className="card border border-white/12 bg-brand-surface/60 p-8 flex flex-col justify-between tilt-card"
          variants={fadeInScale}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
        >
          <div>
            <h3 className="text-white text-xl font-semibold">7-Day Executive Performance Protocol</h3>
            <p className="text-sm text-brand-muted mt-4">
              A structured 7-day framework to establish consistent training and nutrition habits — built for a demanding schedule.
            </p>
          </div>
          <a
            className="btn-secondary mt-8 self-start"
            href="/assets/resources/7-day-kickstart.pdf"
            download
          >
            Download PDF
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
