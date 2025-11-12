import { motion } from 'framer-motion';
import { fadeInUp, fadeInScale } from '../lib/motion';

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
          <h2 className="h2 text-white mt-4">Choose the level of support that keeps you progressing.</h2>
        </div>
        <p className="p lg:max-w-md mt-6 lg:mt-0">
          Both tiers include individualized programming, progress tracking, and weekly adjustments.
          Add nutrition to align fueling with training demands and body composition goals.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div className="card border border-white/15 bg-brand-surface/60 p-8" variants={fadeInScale}>
          <span className="eyebrow text-brand-accent">Performance Coaching</span>
          <h3 className="text-white text-2xl font-semibold mt-4">$250 / month</h3>
          <p className="text-sm text-brand-muted mt-3">
            The complete training partnership for strength athletes and high performers.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/90">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Fully custom periodized training with RPE, tempo, and accessory detail.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Weekly video check-ins with movement review and adjustments.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-accent" />
              <span>Unlimited chat support inside our coaching platform.</span>
            </li>
          </ul>
        </motion.div>
        <motion.div className="card border border-brand-accent/40 bg-brand-surfaceSoft/60 p-8 relative overflow-hidden" variants={fadeInScale}>
          <div className="absolute inset-0 bg-brand-accentSoft blur-3xl opacity-60" />
          <div className="relative">
            <span className="eyebrow text-brand-accent">Nutrition Add-On</span>
            <h3 className="text-white text-2xl font-semibold mt-4">+ $100 / month</h3>
            <p className="text-sm text-brand-muted mt-3">
              Layer in performance nutrition for body composition changes and competitive prep.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>Macro strategy aligned with training phases and energy demands.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>Weekly nutrition feedback loop with habit coaching.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                <span>Supplement and recovery guidance tailored to labs and lifestyle.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
