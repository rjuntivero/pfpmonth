import styles from './Footer.module.css';

export default function Footer() {
  const about = ['Plan your server’s monthly PFP themes with style.'];
  const links = ['Home', 'Themes', 'Polls', 'Submit Idea', 'Github'];
  const credits = ['Made with ❤️ by RJ Untivero', '© 2025 PFPMonth'];
  return (
    <div className={styles.wrapper}>
      <div className={styles.footerContent}>
        <ul>
          <h1>
            <span>PFP</span>Month
          </h1>
          {about.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
        <ul>
          {links.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
        <ul>
          {credits.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
