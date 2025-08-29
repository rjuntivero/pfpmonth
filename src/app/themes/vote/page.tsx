import { fetchServerPoll } from '@/lib/api/poll/fetchServerPoll';
import styles from './page.module.css';
import PollList from '@/components/poll/Poll/PollList/PollList';
import { cookies } from 'next/headers';

export default async function Page() {
  const serverId = (await cookies()).get('server_id')?.value;
  const serverName = (await cookies()).get('server_name')?.value;
  const poll = await fetchServerPoll(serverId as string);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{serverName}</h1>
          <h2>Vote for a Theme</h2>
        </div>
        <div className={styles.polls}>
          <PollList poll={poll} />
        </div>
      </main>
    </div>
  );
}
