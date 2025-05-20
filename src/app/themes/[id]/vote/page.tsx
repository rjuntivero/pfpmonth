import styles from './page.module.css';
import PollList from '@/components/ui/Poll/PollList/PollList';

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { month?: string; year?: string } }) {
  const { id } = await params;
  const { month, year } = await searchParams;

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
          <PollList pollId={id} />
        </div>
      </main>
    </div>
  );
}
