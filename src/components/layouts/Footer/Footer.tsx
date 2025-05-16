import styles from './Footer.module.css';

export default function Footer() {
  const footerLinks = ['About', 'Home', 'Help'];
  return (
    <div className={styles.wrapper}>
      <h1>PFPMonth</h1>
      <ul>
        {footerLinks.map((link) => (
          <li key={link}>{link}</li>
        ))}
      </ul>
    </div>
  );
}
