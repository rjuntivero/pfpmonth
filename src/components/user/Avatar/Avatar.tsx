import Image from 'next/image';
import styles from './Avatar.module.css';
export default function Avatar({ imageURL, className }: { imageURL: string; className?: string }) {
  return (
    <div className={`${styles.avatarContainer} ${className}`}>
      <Image src={imageURL} alt="avatar image" fill className={styles.avatarImage} />
    </div>
  );
}
