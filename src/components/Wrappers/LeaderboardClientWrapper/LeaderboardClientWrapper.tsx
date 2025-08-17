'use client';

import Avatar from '@/components/user/Avatar/Avatar';
import styles from './LeaderboardClientWrapper.module.css';
import UserRanking from '@/components/user/UserRanking/UserRanking';
import { useEffect, useState } from 'react';
import { GuildMember } from '@/types/User';

export default function LeaderboardClientWrapper({ serverName }: { serverName?: string }) {
  const [year, _setYear] = useState('2025');
  const [guildMembers, setGuildMembers] = useState<GuildMember[]>([]);

  useEffect(() => {
    async function fetchGuild() {
      try {
        const guildRes = await fetch('/api/server/members', {
          method: 'GET',
        });
        const guildData = await guildRes.json();
        setGuildMembers(guildData);
        console.log(guildData);
      } catch (err) {
        console.error('Failed to fetch guild data:', err);
      }
    }
    fetchGuild();
  }, []);

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
            <button>May</button>
            <button>2025</button>
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
        {guildMembers?.map((member, i) => (
          <div key={member.discord_users.username}>
            <UserRanking member={member} index={i} />
          </div>
        ))}
      </section>
    </>
  );
}
