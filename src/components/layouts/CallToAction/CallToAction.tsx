'use client';

import styles from './CallToAction.module.css';
import { useEffect, useRef } from 'react';
import { animate, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function StaticText({ text, balooIndices = [] }: { text: string; startIndex?: number; balooIndices?: number[] }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} className={`${balooIndices.includes(i) ? styles.baloo : ''}`} style={{ display: 'inline-block' }}>
          {char}
        </span>
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

  const router = useRouter();

  const handleClick = () => {
    router.push('/themes/vote');
  };

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
          <StaticText text="VOTE " balooIndices={[1]} />
        </span>
        <span style={{ display: 'inline-block', width: '0.3ch' }} />
        <span className={styles.gradientText}>
          <StaticText text="FOR" startIndex={3} balooIndices={[0]} />
          <span style={{ display: 'inline-block', width: '0.1ch' }} /> <span style={{ display: 'inline-block', width: '0.01ch' }} />
          <StaticText text="THE" startIndex={6} balooIndices={[0]} />
          <StaticText text="NEXT" startIndex={9} balooIndices={[0, 1]} /> <span style={{ display: 'inline-block', width: '0.1ch' }} />
          <StaticText text="  THEME" startIndex={12} balooIndices={[0, 4]} />
        </span>
      </h1>

      <Image src="/CallToActionChasm.svg" className={styles.chasm} alt="Chasm" width={1068} height={566} priority />

      <button ref={buttonRef} className={styles.voteBtn} onClick={handleClick}>
        <span className={styles.voteLabel}>Vote here</span>
      </button>
    </section>
  );
}
