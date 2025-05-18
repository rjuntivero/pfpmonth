import Poll from '@/components/ui/Poll/Poll';
import styles from './page.module.css';
import { fetchPollThemes } from '@/lib/fetchPollThemes';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const pollData = await fetchPollThemes({ pollId: id });
  console.log('POLL ID: ', id);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>
            February <span>2025</span>
          </h1>
          <h2>Vote for a Theme</h2>
        </div>
        <div className={styles.polls}>
          {pollData.pollThemes?.map((poll) => (
            <Poll key={poll.id} type="theme" poll={poll} />
          ))}
          <Poll type="upload" />
          <Poll type="upload" />
          <Poll type="upload" />
          <Poll type="upload" />
          <Poll type="upload" />
        </div>
      </main>
    </div>
  );
}
