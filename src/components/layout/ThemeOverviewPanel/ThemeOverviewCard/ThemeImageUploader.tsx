import Image from 'next/image';
import styles from './ThemeOverviewCard.module.css';

interface Props {
  imageUrl: string;
  onChange: (_file: File) => void;
}

export default function ThemeImageUploader({ imageUrl, onChange }: Props) {
  return (
    <label className={styles.uploadLabel}>
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) onChange(e.target.files[0]);
        }}
      />
      <Image src={imageUrl || '/no-image-placeholder.jpg'} alt="Upload preview" width={300} height={300} className={styles.themeImageUpload} />
    </label>
  );
}
