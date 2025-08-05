import styles from './page.module.css';
export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <h1 className={styles.loadingText}>Fetching that for you...</h1>
      </div>
    </div>
  );
}
