'use client';

import { useAppDispatch } from '@/state/hooks';
import Button from '../../Button/Button';
import styles from './ConfirmModal.module.css';
import { closeModal } from '@/features/modalSlice';
import { useRef } from 'react';
import { FetchPollDataResponse } from '@/types/Polls';
import { useRouter } from 'next/navigation';

interface Props {
  poll: any;
}

export default function ConfirmModal({ poll }: Props) {
  const dispatch = useAppDispatch();
  const pollDataRef = useRef<FetchPollDataResponse | null>(null);
  const router = useRouter();
  const promoteToTheme = async (): Promise<void> => {
    try {
      const promoteRes = await fetch(`/api/poll/${poll.id}/promote?month=${poll.theme_month}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const promoteData = await promoteRes.json();
      if (!promoteRes.ok) {
        throw new Error(promoteData.error || 'Failed to promote to theme');
      } else {
        router.push(`/themes`);
      }
    } catch (err) {
      console.error('Failed to promote to theme:', err);
    }
  };

  return (
    <div className={styles.modal}>
      <p>This will make this suggestion the final theme for the month</p>
      <h1>Are you sure?</h1>
      <div className={styles.actions}>
        <Button onClick={promoteToTheme}>Yes</Button>
        <Button onClick={() => dispatch(closeModal())}>No</Button>
      </div>
    </div>
  );
}
