// components/LoginForm.tsx
'use client';

export default function RegisterForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.login - email.value;
    const password = form['login-password'].value;

    // your Supabase login logic here
    console.log(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <label htmlFor="login-email">Email:</label>
      <input type="email" id="login-email" name="login-email" required />

      <label htmlFor="login-password">Password:</label>
      <input type="password" id="login-password" name="login-password" required />

      <button type="submit">Register</button>
    </form>
  );
}
