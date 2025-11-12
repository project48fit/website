import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoaderOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-brand-accent"
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, borderRadius: '30%', transition: { duration: 0.8, ease: [0.83, 0, 0.17, 1] } }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/assets/images/1_logo.png"
              alt="project."
              width={420}
              height={140}
              className="w-[420px] h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
