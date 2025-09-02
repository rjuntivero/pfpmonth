'use client';
import styles from './PollOption.module.css';
import LikeButton from '../../shared/Button/Like/LikeButton';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Avatar from '../../shared/Avatar/Avatar';
import { PollOption as PollType } from '@/lib/api/poll/fetchPollOptions';
import { ServerPoll } from '@/lib/api/poll/fetchServerPoll';

const UploadThemeModal = dynamic(() => import('../../shared/Modal/BaseModal'), { ssr: false });
const ThemeDetailsModal = dynamic(() => import('../../shared/Modal/BaseModal'), { ssr: false });

interface Props {
  poll: ServerPoll;
  option?: PollType;
  type: string;
  refetchThemes?: () => void;
}

export default function PollOption({ poll, option, type, refetchThemes }: Props) {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [voteCount, setVoteCount] = useState<number | null>(option?.vote_count || 0);
  const [hasVoted, setHasVoted] = useState(option?.hasVoted || false);

  const handlePollClick = () => setIsThemeModalOpen(true);
  const handleUploadClick = () => setIsUploadModalOpen(true);

  const formRef = useRef<HTMLFormElement>(null);

  // handle vote
  async function handleVote() {
    try {
      const userRes = await fetch('/api/user');
      const userData = await userRes.json();
      const userId = userData.user?.user_id;

      if (!userId || !option?.id) return;

      const res = await fetch(`/api/polls/options/${option.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (data.voted) {
        setHasVoted(true);
        setVoteCount((prev) => (prev !== null ? prev + 1 : 1));
      } else if (data.notVoted) {
        setHasVoted(false);
        setVoteCount((prev) => (prev !== null ? prev - 1 : 1));
      }
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  }

  // handle poll option upload
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    const serverRes = await fetch('/api/server');
    const serverData = await serverRes.json();
    const serverId = serverData.server?.server_id;

    formData.append('poll_id', option?.id as string);
    formData.append('server_id', serverId as string);

    // upload poll option
    const res = await fetch(`/api/polls/${poll?.id}`, {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      alert('Upload failed: ' + result.error);
    } else {
      setIsUploadModalOpen(false);
      refetchThemes?.();
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
        <h1 className={styles.themeTitle}>{option?.name}</h1>
        <div className={styles.themeContainer}>
          <div className={styles.imageWrapper}>
            <Image src={option?.image_url || '/no-image-placeholder.jpg'} alt="themeImage" fill className={styles.themeImage} />
          </div>
          <div className={styles.themeDetails}>
            <Avatar imageURL={option?.created_by?.avatar_url || '/no-image-placeholder.jpg'} className={styles.avatar} zoom={!option?.created_by?.avatar_url} />
            <h1 className={styles.themeAuthor}>{option?.created_by?.username}</h1>
            <p className={styles.themeComment}>{option?.description}</p>
            <h1 className={styles.themeVotes}>
              {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
            </h1>
            <LikeButton className={`${styles.voteBtn} ${hasVoted ? styles.liked : ''}`} />
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
            '--bg-image': `${`url(${option?.image_url})` || null}`,
          } as React.CSSProperties
        }
        onClick={type === 'theme' ? handlePollClick : handleUploadClick}
      >
        <div className={styles.content}>
          {type === 'theme' && (
            <>
              <h1>{option?.name}</h1>
              <div className={styles.votes}>
                <h2>{voteCount}</h2>
                <h2>{voteCount === 1 ? 'vote' : 'votes'}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote();
                  }}
                >
                  <LikeButton className={`${styles.voteBtn} ${hasVoted ? styles.liked : ''}`} />
                </button>
              </div>
            </>
          )}
          {type === 'upload' && (
            <div className={styles.uploadText}>
              <Image src={'/AddBtn.svg'} width={30} height={30} alt="upload button" />

              <button onClick={(e) => e.stopPropagation()}>
                <h1>Add Theme</h1>
              </button>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
