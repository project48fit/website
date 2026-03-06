import { motion } from 'framer-motion';
import { fadeInScale } from '../lib/motion';

export default function Coaching() {
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
      <div className="section-header flex-col lg:flex-row" >
        <div>
          <p className="eyebrow">Coaching Tiers</p>
          <h2 className="h2 text-white mt-4">Choose the level of support that fits your goals.</h2>
        </div>
        <p className="p lg:max-w-md mt-6 lg:mt-0">
          Both tiers include personalized programming, nutrition guidance, and direct access to your coach.
          Elite adds a fully customized meal plan and concierge-level support for executives who want deeper optimization.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div
          className="card border border-white/15 bg-brand-surface/60 p-8 tilt-card"
          variants={fadeInScale}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
        >
          <span className="eyebrow text-brand-accent">Executive Health &amp; Performance Advisory</span>
          <h3 className="text-white text-2xl font-semibold mt-4">$250 / month</h3>
          <p className="text-sm text-brand-muted mt-3">
            A structured coaching system for executives who want professional accountability for their health and performance.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/90">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Personalized training program built around your schedule and goals.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Personalized nutrition guidance aligned with your training demands.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Monthly strategy call with your coach.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Weekly progress tracking and program adjustments.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Ongoing accountability and 24/7 chat support.</span>
            </li>
          </ul>
        </motion.div>
        <motion.div
          className="card border border-brand-accent/40 bg-brand-surfaceSoft/60 p-8 relative overflow-hidden tilt-card"
          variants={fadeInScale}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-brand-accentSoft blur-3xl opacity-60" />
          <div className="relative">
            <span className="eyebrow text-brand-accent">Executive Performance Elite</span>
            <h3 className="text-white text-2xl font-semibold mt-4">$500 / month</h3>
            <p className="text-sm text-brand-muted mt-3">
              A high-touch performance partnership for executives who want deeper optimization and higher accountability.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>Everything in Advisory, plus:</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>Fully customized meal plan tailored to your lifestyle and travel schedule.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>More frequent coaching interaction and faster response times.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>Higher flexibility and personalization as your schedule shifts.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>Concierge-level support from your coach.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
