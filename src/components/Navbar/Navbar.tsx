import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <ul>
        <li>
          <button className={styles.selected}>Home</button>
        </li>
        <li>
          <button>Leaderboard</button>
        </li>
        <li>
          <button>Upload</button>
        </li>
        <li>
          <button>Themes</button>
        </li>
        <li>
          <button>Profile</button>
        </li>
        <li>
          <button>Settings</button>
        </li>
      </ul>
    </div>
  );
}
