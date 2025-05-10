'use client';

// import { motion } from 'framer-motion';
import styles from './Figure.module.css';
import Image from 'next/image';

// interface FigureProps {
//   stat: string;
// }

export default function Figure() {
  return (
    <article className={styles.stat}>
      <div className={styles.graphicContainer}>
        <Image src="/awog.jpg" alt="Detail Graphic" fill className={styles.graphic} />
      </div>
      <h2 className={styles.statTitle}>Fastest User</h2>
      <h2 className={styles.username}>raipunzel</h2>
    </article>
  );
}
