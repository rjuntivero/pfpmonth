import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <form action="" className={styles.main}>
        <label htmlFor="">Login to your account!</label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
