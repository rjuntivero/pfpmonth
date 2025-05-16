'use client';
import styles from './Poll.module.css';
import LikeButton from '../Button/Like/LikeButton';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const UploadThemeModal = dynamic(() => import('../Modal/BaseModal'), { ssr: false });
const ThemeDetailsModal = dynamic(() => import('../Modal/BaseModal'), { ssr: false });

export default function Poll({ image }: { image: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVoteClick = () => setIsModalOpen(true);
  console.log('Modal is open: ', isModalOpen);

  return (
    <>
      <UploadThemeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className={styles.uploadContent}>
        <h1 className={styles.uploadTitle}>
          <span>Enter a New</span> Theme
        </h1>
        <form action="" className={styles.uploadGrid}>
          <label htmlFor="theme-name">Theme Name*: </label>
          <input type="text" id="theme-name" />
          <label htmlFor="theme-background">Theme Background*: </label>
          <input type="file" id="theme-background" className={styles.fileInput} />
          <label htmlFor="theme-description">Description: </label>
          <input type="textfield" id="theme-description" placeholder="ex: Adventure Time TV Series" />
          <button type="submit">Submit</button>
        </form>
      </UploadThemeModal>
      <article
        className={styles.poll}
        style={
          {
            '--bg-image': `url(${image})`,
          } as React.CSSProperties
        }
        onClick={handleVoteClick}
      >
        <div className={styles.content}>
          <h1>Sinners</h1>
          <div className={styles.votes}>
            <h2>97</h2>
            <h2>votes</h2>
            <button onClick={(e) => e.stopPropagation()}>
              {' '}
              <LikeButton className={styles.voteBtn} />
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
