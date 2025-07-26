'use client';
import styles from './PollOption.module.css';
import LikeButton from '../../shared/Button/Like/LikeButton';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Avatar from '../../user/Avatar/Avatar';
import { Poll as PollType } from '@/types/Polls';
// import User from '../User/User';

const UploadThemeModal = dynamic(() => import('../../shared/Modal/BaseModal'), { ssr: false });
const ThemeDetailsModal = dynamic(() => import('../../shared/Modal/BaseModal'), { ssr: false });

export default function PollOption({ poll: pollOptions, type, onUploadSuccess }: { poll?: PollType; type: string; onUploadSuccess?: () => void }) {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [voteCount, setVoteCount] = useState((pollOptions?.vote_count as number) || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handlePollClick = () => setIsThemeModalOpen(true);
  const handleUploadClick = () => setIsUploadModalOpen(true);

  const formRef = useRef<HTMLFormElement>(null);

  // handle vote
  async function handleVote() {
    try {
      console.log('poll option vote count:', voteCount);
      const userRes = await fetch('/api/user');
      const userData = await userRes.json();
      const userId = userData.user?.user_id;
      console.log('User ID:', userId);

      if (!userId || !pollOptions?.id) return;

      const res = await fetch(`/api/poll/${pollOptions.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (data.voted) {
        setVoteCount((prev) => prev + 1);
        setHasVoted(true);
      } else if (data.notVoted) {
        setVoteCount((prev) => Math.max(0, prev - 1));
        setHasVoted(false);
      }
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  }

  // handle poll upload
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    formData.append('poll_id', pollOptions?.id as string);
    formData.append('server_id', pollOptions?.server_id as string);

    // upload poll
    const res = await fetch('/api/poll', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      alert('Upload failed: ' + result.error);
    } else {
      setIsUploadModalOpen(false);
      onUploadSuccess?.();
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

      {/* Poll Modal */}
      <ThemeDetailsModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} className={styles.themeModalContainer}>
        <h1 className={styles.themeTitle}>{pollOptions?.name}</h1>
        <div className={styles.themeContainer}>
          <div className={styles.imageWrapper}>
            <Image src={pollOptions?.image_url || '/no-image-placeholder.jpg'} alt="themeImage" fill className={styles.themeImage} />
          </div>
          <div className={styles.themeDetails}>
            <Avatar imageURL={pollOptions?.created_by?.avatar_url || '/no-image-placeholder.jpg'} className={styles.avatar} zoom={!pollOptions?.created_by?.avatar_url} />
            <h1 className={styles.themeAuthor}>{pollOptions?.created_by?.username}</h1>
            <p className={styles.themeComment}>{pollOptions?.description}</p>
            <h1 className={styles.themeVotes}>
              {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
            </h1>
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
            '--bg-image': `${`url(${pollOptions?.image_url})` || null}`,
          } as React.CSSProperties
        }
        onClick={type === 'theme' ? handlePollClick : handleUploadClick}
      >
        <div className={styles.content}>
          {type === 'theme' && (
            <>
              <h1>{pollOptions?.name}</h1>
              <div className={styles.votes}>
                <h2>{voteCount}</h2>
                <h2>{voteCount === 1 ? 'vote' : 'votes'}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote();
                  }}
                >
                  <LikeButton className={styles.voteBtn} />
                </button>
              </div>
            </>
          )}
          {type === 'upload' && (
            <>
              <Image src={'/AddBtn.svg'} width={30} height={30} alt="upload button" />

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
