'use client';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: string;
  disabled?: boolean;
}

export default function Button({ children, onClick, type = 'button', variant = 'primary', className, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} type={type} className={`${styles[variant]} ${className || ''}`} disabled={disabled}>
      {children}
    </button>
  );
}
