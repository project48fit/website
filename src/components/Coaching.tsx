import Link from 'next/link';
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
        {/* Advisory */}
        <motion.div
          className="card border border-white/[0.12] bg-brand-surface/60 p-8 tilt-card flex flex-col"
          variants={fadeInScale}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
        >
          <div className="flex-1">
            <span className="eyebrow text-brand-accent">Executive Health &amp; Performance Advisory</span>
            <h3 className="text-white text-2xl font-semibold mt-4">$250 / month</h3>
            <p className="text-sm text-brand-muted mt-3">
              A structured coaching system for executives who want professional accountability for their health and performance.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                <span>Personalized training program built around your schedule and goals.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                <span>Personalized nutrition guidance aligned with your training demands.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                <span>Monthly strategy call with your coach.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                <span>Weekly progress tracking and program adjustments.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                <span>Ongoing accountability and 24/7 chat support.</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <Link href="/apply" className="btn-secondary w-full justify-center text-[0.7rem]">
              Apply for Advisory
            </Link>
          </div>
        </motion.div>

        {/* Elite */}
        <motion.div
          className="card border border-brand-accent/40 bg-brand-surfaceSoft/60 p-8 relative overflow-hidden tilt-card flex flex-col"
          variants={fadeInScale}
          whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-brand-accentSoft blur-3xl opacity-60" />
          <div className="relative flex flex-col flex-1">
            <div className="flex items-start justify-between gap-4">
              <span className="eyebrow text-brand-accent">Executive Performance Elite</span>
              <span className="flex-shrink-0 rounded-full bg-brand-accent/15 border border-brand-accent/30 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-brand-accent">
                Most Popular
              </span>
            </div>
            <h3 className="text-white text-2xl font-semibold mt-4">$500 / month</h3>
            <p className="text-sm text-brand-muted mt-3">
              A high-touch performance partnership for executives who want deeper optimization and higher accountability.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80 flex-1">
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Everything in Advisory, plus:</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Fully customized meal plan tailored to your lifestyle and travel schedule.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white flex-shrink-0" />
                <span>More frequent coaching interaction and faster response times.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Higher flexibility and personalization as your schedule shifts.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Concierge-level support from your coach.</span>
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <Link href="/apply" className="btn-primary w-full justify-center text-[0.7rem]">
                Apply for Elite
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
