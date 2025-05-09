import styles from './CallToAction.module.css';
import Image from 'next/image';

export default function CallToAction() {
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
      <Image src="/CallToActionChasm.svg" className={styles.chasmImage} alt="Chasm" width={1068} height={566} />
      <button className={styles.voteBtn}>
        <span className={styles.voteLabel}>Vote here</span>
      </button>
    </section>
  );
}
