'use client';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: string;
}

export default function Button({ children, onClick, type = 'button', variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} type={type} className={styles[variant]}>
      {children}
    </button>
  );
}
