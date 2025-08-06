import LeaderboardClientWrapper from '@/components/wrappers/LeaderboardClientWrapper/LeaderboardClientWrapper';
import styles from './page.module.css';
import { fetchServer } from '@/lib/api/server/fetchServer';
import { requireAuth } from '@/lib/auth/requireAuth';

export default async function Leaderboard() {
  const serverData = await fetchServer();
  console.log('Server query result:', serverData);
  const serverName = serverData?.data?.servers?.name || 'No Server';

  // ensure user is authenticated
  await requireAuth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LeaderboardClientWrapper serverName={serverName as string} />
      </main>
    </div>
  );
}
