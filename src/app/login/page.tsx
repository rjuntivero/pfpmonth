import styles from './page.module.css';

export default function Login() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form id="login-form">
          <h2>Login</h2>
          <label htmlFor="login-email">Email:</label>
          <input type="email" id="login-email" name="email" required />

          <label htmlFor="login-password">Password:</label>
          <input type="password" id="login-password" name="password" required />

          <button type="submit">Login</button>
        </form>
        <form id="register-form">
          <h2>Register</h2>
          <label htmlFor="register-email">Email:</label>
          <input type="email" id="register-email" name="email" required />

          <label htmlFor="register-password">Password:</label>
          <input type="password" id="register-password" name="password" required />

          <button type="submit">Register</button>
        </form>
      </main>
    </div>
  );
}
