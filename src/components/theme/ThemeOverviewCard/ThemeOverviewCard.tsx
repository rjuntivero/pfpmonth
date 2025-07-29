'use client';
import Button from '../../shared/Button/Button';
import styles from './ThemeOverviewCard.module.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Slide } from '@/types/Slide';
import { useState } from 'react';
import { createTheme, updateTheme, uploadThemeImage } from '@/lib/api/theme/themeActions';
import getCookie from '@/lib/utils/getClientCookie';

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

  // handle theme image upload
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setTempData((prev) => ({
      ...prev,
      image_url: previewUrl,
    }));
  }

  // save edited changes to the theme data
  async function saveChanges() {
    try {
      let newThemeId = theme.id;
      const userRes = await fetch('/api/user');
      const userData = await userRes.json();
      const userId = userData.user?.user_id;
      if (!newThemeId) {
        const { id } = await createTheme({
          name: tempData.name,
          description: tempData.description || 'No description',
          image_url: '',
          server_id: serverId as string,
          created_by: userId,
          theme_month: theme.theme_month,
        });
        newThemeId = id;
      }

      let imageUrl = tempData.image_url;
      if (selectedFile) {
        imageUrl = await uploadThemeImage(serverId as string, selectedFile, theme.month, theme.year.toString());
      }

      await updateTheme(newThemeId, {
        name: tempData.name,
        description: tempData.description || 'No description',
        image_url: imageUrl,
      });
      await onUpdate();
      setEditing(false);
    } catch (err) {
      console.error('Failed to save:', err);
    }
  }

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
        {editing ? (
          <label className={styles.uploadLabel}>
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            <Image alt="Theme image" src={tempData.image_url || '/no-image-placeholder.jpg'} width={300} height={300} className={styles.themeImageUpload} />
          </label>
        ) : (
          <Image alt="Theme image" src={theme.image || '/no-image-placeholder.jpg'} width={300} height={300} className={styles.themeImage} />
        )}
      </div>
      <div className={styles.themeDetails}>
        <div className={`${styles.header} ${type !== 'final' && styles.noTheme}`}>
          <h2>{theme.month}</h2>
          {editing ? (
            <div className={styles.nameInput}>
              <label htmlFor="name">Theme name:</label>
              <input placeholder="type here..." id="name" className={styles.input} value={tempData.name} onChange={(e) => setTempData({ ...tempData, name: e.target.value })} />
            </div>
          ) : (
            <h3>{theme.name}</h3>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className={`${isOpen ? styles.open : ''}`} disabled={editing}>
            +
          </button>
        </div>
        <div className={`${styles.wrapper} ${isOpen ? styles.open : ''}`}>
          <div className={styles.content}>
            {editing ? (
              <div className={styles.descriptionInput}>
                <label htmlFor="description">Description:</label>
                <textarea placeholder="type here..." id="description" className={styles.input} value={tempData.description} onChange={(e) => setTempData({ ...tempData, description: e.target.value })} />
              </div>
            ) : (
              <p>{theme.description || 'No Description'}</p>
            )}
            <div className={styles.controls}>
              {theme.tag !== 'inactive' && (
                <>
                  {editing ? (
                    <>
                      <Button variant="theme-card" onClick={saveChanges}>
                        save
                      </Button>
                      <Button
                        variant="theme-card"
                        onClick={() => {
                          setTempData({
                            name: theme.name,
                            description: theme.description,
                            image_url: theme.image,
                          });
                          setEditing(false);
                        }}
                      >
                        cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      {type !== 'suggestion' ? (
                        <>
                          <Button variant="theme-card" onClick={() => setEditing(true)}>
                            edit
                          </Button>
                          <Button variant="theme-card" onClick={() => onReset?.(theme)}>
                            reset
                          </Button>
                          <Button variant="theme-card" onClick={() => onClaim?.(theme)}>
                            claim
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="theme-card">promote</Button>
                          <Button variant="theme-card" onClick={() => setEditing(true)}>
                            edit
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
