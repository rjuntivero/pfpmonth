import Image from 'next/image';
import styles from './Poll.module.css';

export default function Poll({ image }: { image: string }) {
  return (
    <article className={styles.poll} style={{ ['--bg-image' as any]: `url(${image})` }}>
      <div className={styles.content}>
        <h1>Sinners</h1>
        <div className={styles.votes}>
          <h2>97</h2>
          <h2>votes</h2>
          <Image src={'/vote.svg'} alt="vote button" width={48} height={48} />
        </div>
      </div>
    </article>
  );
}
