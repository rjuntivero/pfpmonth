'use client';
import styles from './ThemeOverviewCard.module.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Slide } from '@/types/Slide';
import { useCallback, useEffect, useState } from 'react';
import { createTheme, updateTheme, uploadThemeImage } from '@/lib/api/theme/themeActions';
import getCookie from '@/lib/utils/getClientCookie';
import ThemeControls from './ThemeControls';
import ThemeEditorForm from './ThemeEditorForm';
import ThemeImageUploader from './ThemeImageUploader';

interface Props {
  type: string;
  theme: Slide;
  onReset?: (_theme: Slide, resetLocalData?: () => void) => void;
  onClaim?: (_theme: Slide) => void;
  index?: number;
  onUpdate: () => void;
}

export default function ThemeOverviewCard({ type, theme, onReset, onClaim, index = 0, onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const serverId = getCookie('server_id');

  const [tempData, setTempData] = useState({
    name: theme.name,
    description: theme.description,
    image_url: theme.image,
  });

  // reset stale data when switching between themes
  const resetLocalData = useCallback(() => {
    setSelectedFile(null);
    setTempData((prev) => ({
      name: theme.name,
      description: theme.description,
      image_url: selectedFile ? prev.image_url : theme.image,
    }));
  }, [theme.description, theme.image, theme.name, selectedFile]);

  useEffect(() => {
    if (!editing) {
      resetLocalData();
    }
  }, [theme, resetLocalData, editing]);

  const handleImageChange = (file: File) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setTempData((prev) => ({ ...prev, image_url: previewUrl }));
  };

  function handleEditorChange(data: { name: string; description: string }) {
    setTempData((prev) => ({
      ...prev,
      name: data.name as string,
      description: data.description as string,
    }));
  }

  // save edited changes
  const saveChanges = async () => {
    try {
      let themeId = theme.id;
      const res = await fetch('/api/user');
      const { user } = await res.json();
      const userId = user?.user_id;

      // upload image first if a new file is selected
      let imageUrl = tempData.image_url;
      if (selectedFile) {
        imageUrl = await uploadThemeImage(serverId as string, selectedFile, theme.month, theme.year.toString());
      }

      // if no theme exists yet, POST
      if (!themeId) {
        const createRes = await fetch(`/api/theme`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...tempData,
            image_url: imageUrl,
            server_id: serverId as string,
            created_by: userId,
            theme_month: theme.theme_month,
          }),
        });

        if (!createRes.ok) throw new Error('Failed to create theme');
        const { id } = await createRes.json();
        themeId = id;
      } else {
        // if theme exists, PATCH
        const patchRes = await fetch(`/api/themes/${themeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...tempData, image_url: imageUrl }),
        });

        if (!patchRes.ok) throw new Error('Failed to update theme');
      }

      await onUpdate();
      setEditing(false);
      resetLocalData();
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  const handleReset = async () => {
    if (onReset) {
      await onReset(theme, resetLocalData);
    } else {
      resetLocalData();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, filter: 'blur(7px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className={`${styles.container} ${isOpen ? styles.open : ''}`}
    >
      <div className={styles.imageWrapper}>
        {editing ? <ThemeImageUploader imageUrl={tempData.image_url} onChange={handleImageChange} /> : <Image src={theme.image || '/no-image-placeholder.jpg'} alt="Theme image" width={300} height={300} className={styles.themeImage} />}
      </div>
      <div className={styles.themeDetails}>
        <div className={`${styles.header} ${type !== 'final' && type !== 'suggestion' && styles.noTheme} ${type === 'suggestion' && styles.suggestion}`}>
          <h2>{theme.month}</h2>
          {editing ? <ThemeEditorForm name={tempData.name} description={tempData.description || 'No Description'} onChange={handleEditorChange} /> : <h3>{theme.name}</h3>}
          <button onClick={() => setIsOpen(!isOpen)} disabled={editing}>
            +
          </button>
        </div>
        {isOpen && (
          <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
            <p>{editing ? null : theme.description || 'No Description'}</p>
            <ThemeControls
              editing={editing}
              type={type}
              onSave={saveChanges}
              onCancel={() => {
                setTempData({
                  name: theme.name,
                  description: theme.description,
                  image_url: theme.image,
                });
                setEditing(false);
              }}
              onEdit={() => setEditing(true)}
              onReset={handleReset}
              onClaim={() => onClaim?.(theme)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
