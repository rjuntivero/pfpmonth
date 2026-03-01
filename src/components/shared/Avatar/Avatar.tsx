import Image from 'next/image';
import styles from './Avatar.module.css';

interface Props {
  imageURL: string;
  className?: string;
  zoom?: boolean;
  editable?: boolean;
  onImageChange?: (_file: File) => void;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}
export default function Avatar({
  imageURL,
  className,
  zoom,
  editable,
  onImageChange,
  onError,
}: Props) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    onImageChange?.(e.target.files[0]);
    e.target.value = '';
  }
  return (
    <label
      className={`${styles.avatarContainer} ${className}`}
      title={editable ? 'Click to upload new image' : undefined}
      style={{ cursor: editable ? 'pointer' : 'default' }}>
      <Image
        src={imageURL}
        alt="avatar image"
        fill
        className={`${styles.avatarImage} ${zoom ? styles.zoomed : ''} ${
          editable ? styles.editable : ''
        }`}
        onError={onError}
      />
      {editable && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      )}
    </label>
  );
}
