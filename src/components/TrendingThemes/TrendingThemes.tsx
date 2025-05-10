import styles from './TrendingThemes.module.css';
export default function TrendingThemes() {
  const trendingThemes = ['Teen Titans', 'Fallout', 'Invincible', 'Presidents', 'Wednesday', 'Halloween', 'Sinners', 'Friday the 13th'];

  return (
    <div className={styles.marquee} aria-hidden="true">
      <ul>
        {trendingThemes.map((theme) => (
          <li key={theme}>{theme}</li>
        ))}
      </ul>
      <ul>
        {trendingThemes.map((theme) => (
          <li key={theme}>{theme}</li>
        ))}
      </ul>
    </div>
  );
}
