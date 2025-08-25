'use client';

import styles from './ThemePanel.module.css';
import { AnimatePresence } from 'motion/react';

interface Props {
  heading?: string;
  children: React.ReactNode;
  className?: string;
  headingClassName?: string;
  contentClassName?: string;
}

export default function ThemePanel({ heading, children, className = '', headingClassName = '', contentClassName = '' }: Props) {
  return (
    <div className={styles.container}>
      {heading && <h1 className={`${styles.heading} ${headingClassName}`}>{heading}</h1>}

      <section className={`${styles.panel} ${className}`}>
        <div className={`${styles.content} ${contentClassName}`}>
          <AnimatePresence>{children}</AnimatePresence>
        </div>
      </section>
    </div>
  );
}
