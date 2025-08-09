import Image from 'next/image';
import styles from './ServerCard.module.css';

interface Props {
  selected?: boolean;
  serverName?: string;
  imageURL?: string;
  onClick?: () => void;
}
export default function ServerCard({ selected, imageURL, serverName, onClick }: Props) {
  return (
    <div className={`${styles.container} ${selected && styles.selected}`} onClick={onClick} role="button" tabIndex={0}>
      <Image src={imageURL || '/no-image-placeholder.jpg'} alt="server image" width={100} height={100} className={styles.serverImage} />
      <p className={styles.serverName}>{serverName}</p>
    </div>
  );
}
