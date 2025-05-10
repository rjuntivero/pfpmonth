import Image from 'next/image';
import styles from './User.module.css';

export default function User() {
  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <Image src="/sinners.jpg" alt="User photo" fill className={styles.avatar} />
      </div>
      <div className={styles.username}>
        <h3>raipunzel</h3>
      </div>
    </div>
  );
}
