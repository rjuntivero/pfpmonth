'use client';
import styles from './CallToAction.module.css';
import { useEffect, useRef } from 'react';
import { animate, useScroll, motion } from 'framer-motion';
import Image from 'next/image';

const floatVariantsArray = [
  { y: [0, -4, 0], x: [0, 1, 0] },
  { y: [0, 3, 0], x: [0, -2, 0] },
  { y: [0, -2, 0], x: [0, 2, 0] },
  { y: [0, 1, 0], x: [0, -1, 0] },
  { y: [0, 2, 0], x: [0, 0, 0] },
];

function FloatingText({ text, startIndex = 0, balooIndices = [] }: { text: string; startIndex?: number; balooIndices?: number[] }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className={balooIndices.includes(i) ? styles.baloo : undefined}
          style={{ display: 'inline-block' }}
          animate={{
            x: floatVariantsArray[(startIndex + i) % floatVariantsArray.length].x,
            y: floatVariantsArray[(startIndex + i) % floatVariantsArray.length].y,
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 3,
            ease: 'easeInOut',
          }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

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
        transform: ['translate(0px, -120px) rotate(-45deg) scale(0.6)', 'translate(100px, -40px) rotate(-15deg) scale(0.8)', 'translate(0px, 0px) rotate(0deg) scale(1)'],
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
      <h1 className={styles.floatingHeader}>
        <span className={styles.vote}>
          <FloatingText text="VOTE " balooIndices={[1]} />
        </span>
        <span style={{ display: 'inline-block', width: '0.3ch' }} />
        <span className={styles.gradientText}>
          <FloatingText text="FOR" startIndex={3} balooIndices={[0]} /> <span style={{ display: 'inline-block', width: '0.1ch' }} />
          <FloatingText text="THE" startIndex={6} balooIndices={[0]} /> <FloatingText text="NEXT" startIndex={9} balooIndices={[0, 1]} /> <FloatingText text="THEME" startIndex={12} balooIndices={[0, 4]} />
        </span>
      </h1>
      <Image src="/CallToActionChasm.svg" className={styles.chasm} alt="Chasm" width={1068} height={566} priority />
      <button ref={buttonRef} className={styles.voteBtn}>
        <span className={styles.voteLabel}>Vote here</span>
      </button>
    </section>
  );
}
