import Avatar from '@/components/user/Avatar/Avatar';
import styles from './page.module.css';
import UserRanking from '@/components/user/UserRanking/UserRanking';

export default function Leaderboard() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.pedestals}>
          <div className={styles.themeDetails}>
            <div className={styles.header}>
              <h2 className={styles.serverName}>barbz</h2>
              <h2 className={styles.date}>May 2025</h2>
            </div>
            <h1 className={styles.themeTitle}>Amazing World of Gumball</h1>
            <div className={styles.filters}>
              <button>filters</button>
              <button>filters</button>
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
      </main>
    </div>
  );
}
