import Poll from '@/components/ui/Poll/Poll';
import styles from './page.module.css';
import { fetchPollThemes } from '@/lib/fetchPollThemes';

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { month?: string; year?: string } }) {
  const { id } = await params;
  const { month, year } = await searchParams;
  const pollData = await fetchPollThemes({ pollId: id });
  console.log('POLL ID: ', id);
  console.log('POLL DATA: ', pollData);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>
            {month || `${new Date().toLocaleString('default', { month: 'long' })}`} <span>{year || `${new Date().getFullYear()}`}</span>
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
