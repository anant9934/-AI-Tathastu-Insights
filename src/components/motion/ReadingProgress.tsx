import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ReadingProgress: React.FC<{ targetId?: string }> = ({ targetId }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed top-16 left-0 right-0 h-[3px] bg-foundation-charcoal/5 dark:bg-white/5 z-40 pointer-events-none"
      role="progressbar"
      aria-label="Reading progress"
    >
      <motion.div
        className="h-full bg-accent-violet origin-left"
        style={{ scaleX }}
      />
    </div>
  );
};
