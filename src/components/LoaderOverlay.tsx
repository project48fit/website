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
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <motion.div
            className="relative h-32 w-32 rounded-[2rem] bg-brand-accent/90 flex items-center justify-center"
            initial={{ scale: 0.8, rotateX: 25, rotateY: -25 }}
            animate={{ scale: 1, rotateX: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Image
              src="/assets/images/1.png"
              alt="project."
              width={120}
              height={120}
              className="w-24 h-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
            />
            <motion.div
              className="absolute inset-0 rounded-[2rem] border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'mirror' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
