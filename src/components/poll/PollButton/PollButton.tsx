'use client';

import Link from 'next/link';
import { motion, scale } from 'framer-motion';
import styles from './PollButton.module.css';

const containerVariants = {
  rest: {},
  hover: {},
};

const backgroundVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.5, borderRadius: '50%', rotate: 153, skewY: 3, transition: { duration: 0.5, type: 'spring' }, backgroundColor: 'var(--main)', y: 20, x: 10 },
};

const textVariants = {
  rest: { x: 0, y: -15, fontVariationSettings: "'wght' 600", color: 'var(--main)', scale: 0.9 },

  hover: { x: -20, rotate: 4, y: -10, scale: 1.4, color: 'var(--accent)', transition: { color: 'var(--accent)', duration: 0.3 }, fontVariationSettings: "'wght' 700" },
};

export default function PollButton() {
  return (
    <Link href="/themes/vote" className={styles.linkWrapper}>
      <motion.div className={styles.pollButton} variants={containerVariants} initial="rest" whileHover="hover" animate="rest">
        <motion.div className={styles.background} variants={backgroundVariants} />

        <motion.p className={styles.pollButtonText} variants={textVariants}>
          Whats popping?
        </motion.p>
      </motion.div>
    </Link>
  );
}
