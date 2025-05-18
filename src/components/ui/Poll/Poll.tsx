'use client';
import styles from './Poll.module.css';
import LikeButton from '../Button/Like/LikeButton';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Avatar from '../User/Avatar/Avatar';
import User from '../User/User';

const UploadThemeModal = dynamic(() => import('../Modal/BaseModal'), { ssr: false });
const ThemeDetailsModal = dynamic(() => import('../Modal/BaseModal'), { ssr: false });

export default function Poll({ image, type }: { image?: string; type: string }) {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleVoteClick = () => setIsThemeModalOpen(true);

  const handleUploadClick = () => setIsUploadModalOpen(true);

  return (
    <>
      <UploadThemeModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} className={styles.uploadModalContent}>
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

      <ThemeDetailsModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} className={styles.themeModalContainer}>
        <h1 className={styles.themeTitle}>Adventure Time</h1>
        <div className={styles.themeContainer}>
          <div className={styles.imageWrapper}>
            <Image src="/adventure.jpg" alt="themeImage" fill className={styles.themeImage} />
          </div>
          <div className={styles.themeDetails}>
            <Avatar imageURL="/bubblegum.jpg" className={styles.avatar} />
            <h1 className={styles.themeAuthor}>untivert</h1>
            <p className={styles.themeComment}>{'"I thought it would be cool ig"'}</p>
            <h1 className={styles.themeVotes}>23 votes</h1>
            <LikeButton className={styles.voteBtn} />
            <h2>Supporting Users:</h2>
            <div className={styles.themeSupporters}>
              <User />
              <User />
              <User />
            </div>
          </div>
        </div>
      </ThemeDetailsModal>
      <article
        className={styles.poll}
        style={
          {
            '--bg-image': `${`url(${image})` || null}`,
          } as React.CSSProperties
        }
        onClick={type === 'theme' ? handleVoteClick : handleUploadClick}
      >
        <div className={styles.content}>
          {type === 'theme' && (
            <>
              <h1>Sinners</h1>
              <div className={styles.votes}>
                <h2>97</h2>
                <h2>votes</h2>
                <button onClick={(e) => e.stopPropagation()}>
                  {' '}
                  <LikeButton className={styles.voteBtn} />
                </button>
              </div>
            </>
          )}
          {type === 'upload' && (
            <>
              <h1>
                <Image src={'/AddBtn.svg'} width={30} height={30} alt="upload button" />
              </h1>

              <button onClick={(e) => e.stopPropagation()}>
                <h1>Add Theme</h1>
              </button>
            </>
          )}
        </div>
      </article>
    </>
  );
}
