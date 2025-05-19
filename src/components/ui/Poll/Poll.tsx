'use client';
import styles from './Poll.module.css';
import LikeButton from '../Button/Like/LikeButton';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Avatar from '../User/Avatar/Avatar';
import { useSearchParams } from 'next/navigation';
// import User from '../User/User';

interface Poll {
  id: string;
  description: string;
  vote_count: number;
  image_url: string;
  created_by: {
    username: string;
    avatar_url?: string;
  };
  name: string;
  supporters: string[];
  month: string;
  year: string;
}

const UploadThemeModal = dynamic(() => import('../Modal/BaseModal'), { ssr: false });
const ThemeDetailsModal = dynamic(() => import('../Modal/BaseModal'), { ssr: false });

export default function Poll({ poll_id, poll, type }: { poll_id: string; poll?: Poll; type: string }) {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  const handleVoteClick = () => setIsThemeModalOpen(true);

  const handleUploadClick = () => setIsUploadModalOpen(true);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    formData.append('poll_id', poll_id as string);
    formData.append('server_id', '1369912474324697139');
    formData.append('month', month as string);
    formData.append('year', year as string);

    const res = await fetch('/api/polls', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      alert('Upload failed: ' + result.error);
    } else {
      alert('Theme uploaded!');
      setIsUploadModalOpen(false);
    }
  }
  return (
    <>
      <UploadThemeModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} className={styles.uploadModalContent}>
        <h1 className={styles.uploadTitle}>
          <span>Enter a New</span> Theme
        </h1>
        <form ref={formRef} onSubmit={handleSubmit} className={styles.uploadGrid}>
          <label htmlFor="theme-name">Theme Name*: </label>
          <input type="text" id="theme-name" name="theme-name" />
          <label htmlFor="theme-image">Theme Image: </label>
          <input type="file" id="theme-image" name="theme-image" className={styles.fileInput} />
          <label htmlFor="theme-description">Description: </label>
          <input type="text" id="theme-description" name="theme-description" placeholder="ex: Adventure Time TV Series" />
          <button type="submit">Submit</button>
        </form>
      </UploadThemeModal>

      <ThemeDetailsModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} className={styles.themeModalContainer}>
        <h1 className={styles.themeTitle}>{poll?.name}</h1>
        <div className={styles.themeContainer}>
          <div className={styles.imageWrapper}>
            <Image src={poll?.image_url || '/no-image-placeholder.jpg'} alt="themeImage" fill className={styles.themeImage} />
          </div>
          <div className={styles.themeDetails}>
            <Avatar imageURL="/bubblegum.jpg" className={styles.avatar} />
            <h1 className={styles.themeAuthor}>{poll?.created_by?.username}</h1>
            <p className={styles.themeComment}>{poll?.description}</p>
            <h1 className={styles.themeVotes}>{poll?.vote_count} votes</h1>
            <LikeButton className={styles.voteBtn} />
            <h2>Supporting Users:</h2>
            <div className={styles.themeSupporters}>
              {/* {poll?.supporters.map((user) => {
                <User key={user} user={user.} />;
              })} */}
              {/* <User />
              <User />
              <User /> */}
            </div>
          </div>
        </div>
      </ThemeDetailsModal>
      <article
        className={styles.poll}
        style={
          {
            '--bg-image': `${`url(${poll?.image_url})` || null}`,
          } as React.CSSProperties
        }
        onClick={type === 'theme' ? handleVoteClick : handleUploadClick}
      >
        <div className={styles.content}>
          {type === 'theme' && (
            <>
              <h1>{poll?.name}</h1>
              <div className={styles.votes}>
                <h2>{poll?.vote_count}</h2>
                <h2>votes</h2>
                <button onClick={(e) => e.stopPropagation()}>
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
