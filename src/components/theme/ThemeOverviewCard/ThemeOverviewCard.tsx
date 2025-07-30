'use client';
import styles from './ThemeOverviewCard.module.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Slide } from '@/types/Slide';
import { useState } from 'react';
import { createTheme, updateTheme, uploadThemeImage } from '@/lib/api/theme/themeActions';
import getCookie from '@/lib/utils/getClientCookie';
import ThemeControls from './ThemeControls';
import ThemeEditorForm from './ThemeEditorForm';
import ThemeImageUploader from './ThemeImageUploader';

interface Props {
  type: string;
  theme: Slide;
  onReset?: (theme: Slide) => void;
  onClaim?: (theme: Slide) => void;
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

  const handleImageChange = (file: File) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setTempData((prev) => ({ ...prev, image_url: previewUrl }));
  };

  const saveChanges = async () => {
    try {
      let themeId = theme.id;
      const res = await fetch('/api/user');
      const { user } = await res.json();
      const userId = user?.user_id;

      if (!themeId) {
        const { id } = await createTheme({ ...tempData, server_id: serverId, created_by: userId, theme_month: theme.theme_month });
        themeId = id;
      }

      let imageUrl = tempData.image_url;
      if (selectedFile) {
        imageUrl = await uploadThemeImage(serverId, selectedFile, theme.month, theme.year.toString());
      }

      await updateTheme(themeId, { ...tempData, image_url: imageUrl });
      await onUpdate();
      setEditing(false);
    } catch (err) {
      console.error('Failed to save theme:', err);
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
          {editing ? <ThemeEditorForm name={tempData.name} description={tempData.description || 'No Description'} onChange={setTempData} /> : <h3>{theme.name}</h3>}
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
              onReset={() => onReset?.(theme)}
              onClaim={() => onClaim?.(theme)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
