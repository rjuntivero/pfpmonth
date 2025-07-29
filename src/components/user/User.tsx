import Image from 'next/image';
import styles from './User.module.css';
import { Participant } from '@/types/Participant';

export default function User({ participant }: { participant?: Participant }) {
  console.log('Participant', participant);
  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <Image src={participant?.image_url || '/no-image-placeholder.jpg'} alt="User photo" fill className={styles.avatar} />
      </div>
      <div className={styles.user}>
        <h3 className={styles.username}>{participant?.username}</h3>
        <h3 className={styles.character}>{participant?.character_name}</h3>
      </div>
    </div>
  );
}
