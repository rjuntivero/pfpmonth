'use client';
import styles from './CallToAction.module.css';
import { useEffect, useRef } from 'react';
import { animate, useScroll } from 'framer-motion';
import Image from 'next/image';

export default function CallToAction() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animControls = useRef<ReturnType<typeof animate> | null>(null);

  const { scrollYProgress } = useScroll({
    target: buttonRef,
    offset: ['start 100%', 'end 50%'],
  });

  useEffect(() => {
    if (!buttonRef.current) return;

    animControls.current = animate(
      buttonRef.current,
      {
        opacity: [0, 0.25, 1],
        transform: ['translate(0px, -100px) rotate(-45deg) scale(0.6)', 'translate(100px, -60px) rotate(-15deg) scale(0.8)', 'translate(0px, 0px) rotate(0deg) scale(1)'],
      },
      {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
      }
    );

    animControls.current.pause();

    return scrollYProgress.on('change', (progress) => {
      if (!animControls.current) return;
      animControls.current.time = progress * animControls.current.duration;
    });
  }, [scrollYProgress]);
  return (
    <section className={styles.wrapper}>
      <h1>
        <span className={styles.vote}>
          V<span className={styles.baloo}>O</span>TE
        </span>
        <span className={styles.gradientText}>
          <span className={styles.baloo}>F</span>OR T<span className={styles.baloo}>H</span>E N<span className={styles.baloo}>EX</span>T TH<span className={styles.baloo}>E</span>M<span className={styles.baloo}>E</span>
        </span>
      </h1>
      <Image src="/CallToActionChasm.svg" className={styles.chasm} alt="Chasm" width={1068} height={566} />
      <button ref={buttonRef} className={styles.voteBtn}>
        <span className={styles.voteLabel}>Vote here</span>
      </button>
    </section>
  );
}
