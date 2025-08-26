import LeaderboardClientWrapper from '@/components/wrappers/LeaderboardClientWrapper/LeaderboardClientWrapper';
import styles from './page.module.css';
import { fetchServer } from '@/lib/api/server/fetchServer';

export default async function Leaderboard() {
  const server = await fetchServer();
  const serverName = server?.name || 'No Server';

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LeaderboardClientWrapper serverName={serverName} serverId={server?.server_id} />
      </main>
    </div>
  );
}
