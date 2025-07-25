import Image from 'next/image';
import styles from './Avatar.module.css';

interface Props {
  imageURL: string;
  className?: string;
  zoom?: boolean;
}
export default function Avatar({ imageURL, className, zoom }: Props) {
  return (
    <div className={`${styles.avatarContainer} ${className}`}>
      <Image src={imageURL} alt="avatar image" fill className={`${styles.avatarImage} ${zoom ? styles.zoomed : ''}`} />
    </div>
  );
}
