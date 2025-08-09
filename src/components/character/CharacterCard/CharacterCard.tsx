import Image from 'next/image';
import styles from './CharacterCard.module.css';

interface Props {
  selected?: boolean;
  imageURL?: string;
  characterName?: string;
  onClick?: () => void;
}
export default function CharacterCard({ selected, imageURL, characterName, onClick }: Props) {
  return (
    <div className={`${styles.container} ${selected && styles.selected}`} onClick={onClick} role="button" tabIndex={0}>
      <Image src={imageURL || '/no-image-placeholder.jpg'} alt="server image" width={85} height={85} className={styles.serverImage} />
      <p className={styles.serverName}>{characterName}</p>
    </div>
  );
}
