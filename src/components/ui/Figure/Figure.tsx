import styles from './Figure.module.css';
// import { motion } from 'framer-motion';
import Image from 'next/image';

// interface FigureProps {
//   stat: string;
// }

export default function Figure() {
  return (
    <article className={styles.stat}>
      <div className={styles.iconContainer}>
        <Image src="/crown.svg" alt="Crown Graphic" width={50} height={50} className={styles.icon} />
      </div>
      <div className={styles.graphicContainer}>
        <Image src="/happy.png" alt="Detail Graphic" fill className={styles.graphic} />
      </div>
      <h2 className={styles.statTitle}>Fastest User</h2>
      <h2 className={styles.username}>raipunzel</h2>
    </article>
  );
}
