'use client';

import Avatar from '@/components/user/Avatar/Avatar';
import styles from './LeaderboardClientWrapper.module.css';
import UserRanking from '@/components/user/UserRanking/UserRanking';
import { useEffect, useState } from 'react';
import { GuildMember } from '@/types/User';
import { motion } from 'framer-motion';

export default function LeaderboardClientWrapper({ serverName }: { serverName?: string }) {
  const [year, _setYear] = useState('2025');
  const [guildMembers, setGuildMembers] = useState<GuildMember[]>([]);

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const [chosenMonth, setChosenMonth] = useState<string>(currentMonth);
  const [chosenYear, setChosenYear] = useState<string>(year);

  //temp test data for top users
  const users = [
    { name: 'rjflavorred', imageURL: '/profile.webp' },
    { name: 'raipunzel', imageURL: '/bubblegum.jpg' },
    { name: 'Aurora', imageURL: '/simpsons.avif' },
  ];

  // // test data of 20 users
  // const testGuildMembers: GuildMember[] = Array.from({ length: 20 }, (_, i) => ({
  //   user_id: `user-${i + 1}`,
  //   discord_users: {
  //     username: `User${i + 1}`,
  //     avatar_url: '/profile.webp',
  //   },
  //   rank: i + 1, // pretend rank is index + 1
  // }));

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // max users per page
  const totalPages = Math.max(1, Math.ceil(guildMembers.length / pageSize));

  const startIndex = (currentPage - 1) * pageSize;
  const currentMembers = guildMembers.slice(startIndex, startIndex + pageSize);

  // Handlers
  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

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
          </div>
          <h1 className={styles.themeTitle}>Adventure Time</h1>
          <div className={styles.filters}>
            <button>{chosenMonth}</button>
            <button>{chosenYear}</button>
          </div>
        </div>
        <div className={styles.topUsers}>
          {users.map((user, index) => (
            <motion.div key={user.name} className={styles.topUser} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} data-name={user.name}>
              <Avatar imageURL={user.imageURL} className={styles.topUserAvatar} />
            </motion.div>
          ))}
        </div>
      </section>
      {/* <section className={styles.rankingList}>
        <div className={styles.pageNav}>
          <button>{'<  '} </button>1 of 1 <button>{'  >'}</button>
        </div>
        {guildMembers?.map((member, i) => (
          <div key={member.discord_users.username}>
            <UserRanking member={member} index={i} />
          </div>
        ))}
      </section> */}
      {/* pagination test */}
      <section className={styles.rankingList}>
        <div className={styles.pageNav}>
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            {'<'}
          </button>
          &nbsp; Page {currentPage} of {totalPages} &nbsp;
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            {'>'}
          </button>
        </div>

        {currentMembers.map((member, i) => (
          <div key={member.discord_users.username}>
            <UserRanking member={member} index={startIndex + i} />
          </div>
        ))}
      </section>
    </>
  );
}
