'use client';

import Avatar from '@/components/user/Avatar/Avatar';
import styles from './LeaderboardClientWrapper.module.css';
import UserRanking from '@/components/user/UserRanking/UserRanking';
import { useState } from 'react';

export default function LeaderboardClientWrapper({ serverName }: { serverName?: string }) {
  const [year, setYear] = useState('2025');
  return (
    <>
      <section className={styles.pedestals}>
        <div className={styles.themeDetails}>
          <div className={styles.header}>
            <h2 className={styles.serverName}>{serverName}</h2>
            <h2 className={styles.date}>May {year}</h2>
          </div>
          <h1 className={styles.themeTitle}>Adventure Time</h1>
          <div className={styles.filters}>
            <button>2025</button>
            <button>Adventure..</button>
          </div>
        </div>
        <div className={styles.topUsers}>
          <div className={styles.topUser}>
            <Avatar imageURL={'/bubblegum.jpg'} className={`${styles.topUserAvatar}`} />
          </div>
          <div className={styles.topUser}>
            <Avatar imageURL={'/bubblegum.jpg'} className={`${styles.topUserAvatar}`} />
          </div>
          <div className={styles.topUser}>
            <Avatar imageURL={'/bubblegum.jpg'} className={`${styles.topUserAvatar}`} />
          </div>
        </div>
      </section>
      <section className={styles.rankingList}>
        <div className={styles.pageNav}>
          <button>{'<  '} </button>1 of 1 <button>{'  >'}</button>
        </div>
        <UserRanking />
        <UserRanking />
        <UserRanking />
        <UserRanking />
        <UserRanking />
        <UserRanking />
        <UserRanking />
      </section>
    </>
  );
}
