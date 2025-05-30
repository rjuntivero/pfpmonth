'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button/Button';
import BaseModal from '@/components/shared/Modal/BaseModal';
import styles from './JoinThemeWrapper.module.css';

export default function JoinThemeWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Join Theme
      </Button>
      <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)} className={styles.joinModal}>
        <h1>Join this theme</h1>
        <p>Modal content goes here.</p>
      </BaseModal>
    </>
  );
}
