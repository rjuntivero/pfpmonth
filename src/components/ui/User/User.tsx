import Image from 'next/image';
import styles from './User.module.css';

export default function User() {
  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <Image src="/bubblegum.jpg" alt="User photo" fill className={styles.avatar} />
      </div>
      <div className={styles.user}>
        <h3 className={styles.username}>raipunzel</h3>
        <h3 className={styles.character}>Princess Bubblegum</h3>
      </div>
    </div>
  );
}
