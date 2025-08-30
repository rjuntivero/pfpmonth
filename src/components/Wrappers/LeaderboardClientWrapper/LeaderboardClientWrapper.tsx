'use client';

import Avatar from '@/components/shared/Avatar/Avatar';
import styles from './LeaderboardClientWrapper.module.css';
import UserRanking from '@/components/user/UserRanking/UserRanking';
import { useEffect, useState } from 'react';
import { GuildMemberRank } from '@/types/User';
import { motion } from 'framer-motion';
import Dropdown from '@/components/shared/Dropdown/Dropdown';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { setChosenMonth, setChosenYear, setLoaded } from '@/features/leaderboardSlice';
import { MONTHS as monthNames } from '@/lib/utils/stringUtils';
import { ThemeData } from '@/lib/api/theme/fetchThemeData';

interface Props {
  serverName: string;
}

interface TopUser {
  name?: string;
  imageURL?: string;
}

export default function LeaderboardClientWrapper({ serverName }: Props) {
  const [currentYear, _setYear] = useState('2025');
  const [guildMembers, setGuildMembers] = useState<GuildMemberRank[]>([]);
  const [chosenTheme, setChosenTheme] = useState<ThemeData>();
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });

  const dispatch = useAppDispatch();
  const chosenMonth = useAppSelector((state) => state.leaderboard.chosenMonth);
  const chosenYear = useAppSelector((state) => state.leaderboard.chosenYear);

  const years = ['2025', '2026', '2015', '2016', '2017', '2018', '2019', '2020'];
  const pedestalOrder = [1, 0, 2];

  // initialize chosenYear and chosenMonth
  useEffect(() => {
    dispatch(setChosenYear(currentYear));
    dispatch(setChosenMonth(currentMonth));
  }, [dispatch, currentYear, currentMonth]);

  const [_isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [_isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

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

  // fetch all guildMembers in the server given serverId
  useEffect(() => {
    async function fetchGuild() {
      try {
        dispatch(setLoaded(true));
        const guildRes = await fetch('/api/server/members', {
          method: 'GET',
        });
        const guildData = await guildRes.json();
        setGuildMembers(guildData);

        const rankRes = await fetch(`/api/server/members/rankings`, {
          method: 'POST',
          body: JSON.stringify({
            chosenMonth,
            chosenYear,
            guildData,
          }),
        });

        console.log(guildData);
        dispatch(setLoaded(false));
        const { sortedMembers, topUsers, theme } = await rankRes.json();
        setChosenTheme(theme);
        setGuildMembers(sortedMembers);
        setTopUsers(
          topUsers.map((m: GuildMemberRank) => ({
            name: m.discord_users?.username ?? 'Unknown',
            imageURL: m.discord_users?.avatar_url ?? null,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch guild data:', err);
      }
    }
    fetchGuild();
  }, [chosenMonth, chosenYear, dispatch]);

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
          <h1 className={styles.themeTitle}>{chosenTheme?.name ?? 'No Theme'}</h1>
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
            pedestalOrder.map((rank, i) => {
              const user = topUsers[rank];
              return (
                <motion.div key={rank} className={styles.topUser} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} data-name={user?.name ?? 'N/A'}>
                  <Avatar imageURL={user?.imageURL ?? '/no-image-placeholder.jpg'} className={styles.topUserAvatar} zoom={user?.imageURL ? false : true} />
                </motion.div>
              );
            })
          )}
        </div>
      </section>

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
              <UserRanking score={member.score} member={member} index={startIndex + i} />
            </div>
          ))
        )}
      </section>
    </>
  );
}
