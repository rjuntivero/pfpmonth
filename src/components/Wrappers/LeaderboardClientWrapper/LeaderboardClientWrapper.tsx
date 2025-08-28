'use client';

import Avatar from '@/components/user/Avatar/Avatar';
import styles from './LeaderboardClientWrapper.module.css';
import UserRanking from '@/components/user/UserRanking/UserRanking';
import { useEffect, useState } from 'react';
import { GuildMember } from '@/types/User';
import { AnimatePresence, motion } from 'framer-motion';
import DropdownIcon from '@/components/shared/Dropdown/DropdownIcon/DropdownIcon';
import Dropdown from '@/components/shared/Dropdown/Dropdown';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { setChosenMonth, setChosenYear, setLoaded } from '@/features/leaderboardSlice';

interface Props {
  serverName: string;
  serverId?: string;
}

export default function LeaderboardClientWrapper({ serverName, serverId }: Props) {
  const [currentYear, _setYear] = useState('2025');
  const [guildMembers, setGuildMembers] = useState<GuildMember[]>([]);

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });

  const dispatch = useAppDispatch();
  const chosenMonth = useAppSelector((state) => state.leaderboard.chosenMonth);
  const chosenYear = useAppSelector((state) => state.leaderboard.chosenYear);

  // initialize chosenYear and chosenMonth
  useEffect(() => {
    dispatch(setChosenYear(currentYear));
    dispatch(setChosenMonth(currentMonth));
  }, [dispatch, currentYear, currentMonth]);

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  //temp test data for top users
  const users = [
    { name: 'rjflavorred', imageURL: '/profile.webp' },
    { name: 'raipunzel', imageURL: '/bubblegum.jpg' },
    { name: 'pluviosprout', imageURL: '/simpsons.avif' },
  ];

  const years = ['2015', '2016', '2017', '2018', '2019', '2020'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // // test data of 20 users
  // const testGuildMembers: GuildMember[] = Array.from({ length: 20 }, (_, i) => ({
  //   user_id: `user-${i + 1}`,
  //   discord_users: {
  //     username: `User${i + 1}`,
  //     avatar_url: '/profile.webp',
  //   },
  //   rank: i + 1, // pretend rank is index + 1
  // }));
  const loading = useAppSelector((state) => state.leaderboard.loaded);
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
        dispatch(setLoaded(true));
        const guildRes = await fetch('/api/server/members', {
          method: 'GET',
        });
        const guildData = await guildRes.json();
        setGuildMembers(guildData);
        // await fetchRankings(chosenMonth, chosenYear, serverId, guildData);
        console.log(guildData);
        dispatch(setLoaded(false));
      } catch (err) {
        console.error('Failed to fetch guild data:', err);
      }
    }
    fetchGuild();
  }, []);

  // dropdown logic
  const toggleMonthDropdown = () => {
    setIsMonthDropdownOpen((prev) => !prev);
  };

  const toggleYearDropdown = () => {
    setIsYearDropdownOpen((prev) => !prev);
  };

  const handleMonthSelect = (month: string) => {
    dispatch(setChosenMonth(month));
    setIsMonthDropdownOpen(false);
  };

  const handleYearSelect = (year: string) => {
    dispatch(setChosenYear(year));
    setIsYearDropdownOpen(false);
  };

  return (
    <>
      <section className={styles.pedestals}>
        <div className={styles.themeDetails}>
          <h2 className={styles.serverName}>{serverName}</h2>
          <h1 className={styles.themeTitle}>Adventure Time</h1>
          <div className={styles.filters}>
            <Dropdown onSelect={handleMonthSelect} selected={chosenMonth} items={monthNames} />
            <Dropdown onSelect={handleYearSelect} selected={chosenYear} items={years} />
          </div>
        </div>
        <div className={styles.topUsers}>
          {loading ? (
            <div className={styles.loaderWrapper}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            users.map((user, index) => (
              <motion.div key={user.name} className={styles.topUser} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} data-name={user.name}>
                <Avatar imageURL={user.imageURL} className={styles.topUserAvatar} />
              </motion.div>
            ))
          )}
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
        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.loader}></div>
          </div>
        ) : (
          currentMembers.map((member, i) => (
            <div key={member.discord_users.username}>
              <UserRanking member={member} index={startIndex + i} />
            </div>
          ))
        )}
      </section>
    </>
  );
}
