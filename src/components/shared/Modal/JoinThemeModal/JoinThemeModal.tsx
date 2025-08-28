'use client';

import { useState } from 'react';
import styles from './JoinThemeModal.module.css';
import Avatar from '@/components/shared/Avatar/Avatar';
import CharacterSearch from '@/components/character/CharacterSearch/CharacterSearch';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { updateCharacterImage } from '@/features/characterSlice';
import ParticipantList from '@/components/theme/ParticipantList/ParticipantList';
import ImageCropper from '@/components/shared/ImageCropper/ImageCropper';

interface Props {
  themeTitle?: string;
  themeId: string;
  username?: string;
}

export default function JoinThemeModal({ themeTitle, themeId, username }: Props) {
  const character = useAppSelector((state) => state.character.chosenCharacter[themeId]) || {
    name: 'No Character',
    image_url: '/no-image-placeholder.jpg',
  };

  const dispatch = useAppDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(character.image_url);

  const handleImageChange = (file: File) => {
    setSelectedFile(file);
    setShowCropper(true);
  };

  const handleCropConfirm = async (croppedDataUrl: string) => {
    // Update UI immediately
    dispatch(updateCharacterImage({ themeId, image_url: croppedDataUrl }));
    setPreviewUrl(croppedDataUrl);
    setShowCropper(false);

    // Extract base64 to upload
    const base64Data = croppedDataUrl.split(',')[1];

    const res = await fetch('/api/user/character/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        themeId,
        fileBase64: base64Data,
        fileName: selectedFile?.name,
        name: character.name,
      }),
    });

    const data = await res.json();
    if (data.success && data.character) {
      dispatch(updateCharacterImage({ themeId, image_url: data.character.image_url }));
      setPreviewUrl(data.character.image_url);
    } else {
      console.error('Failed to upload character image', data.error);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
  };

  return (
    <>
      <div className={styles.modalWrapper}>
        <div className={styles.content}>
          <div className={styles.actions}>
            <Avatar editable={true} onImageChange={handleImageChange} imageURL={previewUrl || '/no-image-placeholder.jpg'} className={styles.avatar} zoom={true} />
            <h2 className={styles.username}>{username}</h2>
            <h2 className={styles.characterName}>{character.name}</h2>
            <CharacterSearch themeTitle={themeTitle} themeId={themeId} />
            <article className={styles.manualSearch}>
              <p>or... Enter manually</p>
            </article>
          </div>
          <div className={styles.participants}>
            <h1 className={styles.participantTitle}>Claimed Characters</h1>
            <ParticipantList />
          </div>
        </div>
      </div>

      {showCropper && selectedFile && <ImageCropper imageSrc={URL.createObjectURL(selectedFile)} onCancel={handleCropCancel} onConfirm={handleCropConfirm} />}
    </>
  );
}
