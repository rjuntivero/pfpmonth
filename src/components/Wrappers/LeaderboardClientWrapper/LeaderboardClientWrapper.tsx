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
import { AvailableTime } from '@/lib/api/user/fetchRankings';
import Image from 'next/image';

interface Props {
  serverName: string;
}

interface TopUser {
  name?: string;
  imageURL?: string;
}

export default function LeaderboardClientWrapper({ serverName }: Props) {
  const [guildMembers, setGuildMembers] = useState<GuildMemberRank[]>([]);
  const [chosenTheme, setChosenTheme] = useState<ThemeData>();
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [monthsDropdown, setMonthsDropdown] = useState<string[]>([]);
  const [yearsDropdown, setYearsDropdown] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [rankingType, setRankingType] = useState<'All Time' | 'Monthly'>('Monthly');

  const dispatch = useAppDispatch();
  const chosenMonth = useAppSelector((state) => state.leaderboard.chosenMonth);
  const chosenYear = useAppSelector((state) => state.leaderboard.chosenYear);

  const pedestalOrder = [1, 0, 2];

  // initialize chosenYear and chosenMonth
  useEffect(() => {
    if (availableTimes.length > 0 && (!chosenYear || !chosenMonth)) {
      const first = availableTimes[0];
      dispatch(setChosenYear(first.year.toString()));
      dispatch(setChosenMonth(monthNames[first.month - 1]));
    }
  }, [availableTimes, chosenYear, chosenMonth, dispatch]);

  // Dropdown states
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isRankingDropdownOpen, setIsRankingDropdownOpen] = useState(false);

  const loading = useAppSelector((state) => state.leaderboard.loaded);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
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

        // fetch members
        const guildRes = await fetch('/api/server');
        const guildData = await guildRes.json();
        setGuildMembers(guildData.sortedMembers as GuildMemberRank[]);

        // fetch rankings
        const rankRes = await fetch('/api/server/rankings', {
          method: 'POST',
          body: JSON.stringify({ chosenMonth, chosenYear, guildData: guildData.sortedMembers, rankingType }),
        });

        const {
          sortedMembers,
          topUsers: topUserRanks,
          theme,
          availableTimes,
        }: {
          sortedMembers: GuildMemberRank[];
          topUsers: GuildMemberRank[];
          theme: ThemeData | null;
          availableTimes: AvailableTime[];
        } = await rankRes.json();

        setAvailableTimes(availableTimes);
        setChosenTheme(theme ?? undefined);
        setGuildMembers(sortedMembers);

        // update dropdowns
        const uniqueYears = Array.from(new Set(availableTimes.map((t) => t.year.toString()))).sort();
        setYearsDropdown(uniqueYears);

        const monthsForYear = availableTimes
          .filter((t) => t.year.toString() === chosenYear)
          .map((t) => t.month)
          .sort((a, b) => a - b);
        setMonthsDropdown(monthsForYear.map((m) => monthNames[m - 1]));

        setTopUsers(
          topUserRanks.map((m) => ({
            name: m.discord_users?.username ?? 'Unknown',
            imageURL: m.discord_users?.avatar_url ? `${m.discord_users.avatar_url}?size=512` : undefined,
          }))
        );

        dispatch(setLoaded(false));
      } catch (err) {
        console.error('Failed to fetch guild data:', err);
        dispatch(setLoaded(false));
      }
    }

    fetchGuild();
  }, [chosenMonth, chosenYear, dispatch, rankingType]);

  const handleYearSelect = (year: string) => {
    setIsYearDropdownOpen(false);
    setIsMonthDropdownOpen(false);
    dispatch(setChosenYear(year));

    // use the availableTimes from state
    const monthsForYear = availableTimes.filter((t) => t.year.toString() === year).map((t) => monthNames[t.month - 1]);

    // pick first available month if current chosenMonth is invalid
    const newMonth = monthsForYear.includes(chosenMonth) ? chosenMonth : monthsForYear[0];

    dispatch(setChosenMonth(newMonth));
  };

  const handleMonthSelect = (month: string) => {
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
    dispatch(setChosenMonth(month));
  };

  const handleTypeSelect = (type: string) => {
    setIsRankingDropdownOpen(false);
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
    setRankingType(type as 'All Time' | 'Monthly');
  };

  return (
    <>
      <section className={styles.pedestals}>
        <div className={styles.themeDetails}>
          <h2 className={styles.serverName}>{serverName}</h2>
          <h1 className={styles.themeTitle}>{chosenTheme?.name ?? 'No Theme'}</h1>
          <div className={styles.filters}>
            <Dropdown selected={chosenMonth} items={monthsDropdown} onSelect={handleMonthSelect} isOpen={isMonthDropdownOpen} setIsOpen={setIsMonthDropdownOpen} disabled={rankingType === 'All Time'} />
            <Dropdown onSelect={handleYearSelect} selected={chosenYear} items={yearsDropdown} isOpen={isYearDropdownOpen} setIsOpen={setIsYearDropdownOpen} disabled={rankingType === 'All Time'} />{' '}
            <Dropdown selected={rankingType} items={['All Time', 'Monthly']} onSelect={handleTypeSelect} isOpen={isRankingDropdownOpen} setIsOpen={setIsRankingDropdownOpen} />
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
              <UserRanking score={member.score} member={member} index={startIndex + i} rankingType={rankingType} />
            </div>
          ))
        )}
      </section>
    </>
  );
}
