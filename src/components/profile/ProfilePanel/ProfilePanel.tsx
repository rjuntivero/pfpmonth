'use client';

import styles from './ProfilePanel.module.css';

interface Props {
  heading?: string;
  children: React.ReactNode;
  className?: string;
  headingClassName?: string;
  contentClassName?: string;
  headerAction?: React.ReactNode;
}

export default function ProfilePanel({ heading, children, className = '', headingClassName = '', contentClassName = '', headerAction }: Props) {
  return (
    <div className={styles.container}>
      {heading && (
        <div className={styles.headerRow}>
          <h1 className={`${styles.heading} ${headingClassName}`}>{heading}</h1>
          {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
        </div>
      )}

      <section className={`${styles.panel} ${className}`}>
        <div className={`${styles.content} ${contentClassName}`}>{children}</div>
      </section>
    </div>
  );
}
