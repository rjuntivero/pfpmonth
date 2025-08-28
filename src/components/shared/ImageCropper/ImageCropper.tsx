'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import styles from './ImageCropper.module.css';
import { getCroppedImage } from '@/lib/utils/getCroppedImage';

interface Props {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (croppedDataUrl: string) => void;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageCropper({ imageSrc, onCancel, onConfirm }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels);
    onConfirm(croppedImage);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.cropperContainer}>
        <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
        <div className={styles.controls}>
          <input className={styles.slider} type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          <div className={styles.buttons}>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}
