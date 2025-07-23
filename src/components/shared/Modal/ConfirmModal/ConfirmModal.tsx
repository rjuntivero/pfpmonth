'use client';
import { useAppDispatch } from '@/state/hooks';
import Button from '../../Button/Button';
import styles from './ConfirmModal.module.css';
import { closeModal } from '@/features/modalSlice';

export default function ConfirmModal() {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className={styles.modal}>
        <div>
          <p>This will make this suggestion the final theme for the month</p>
        </div>
        <div>
          <h1>Are you sure?</h1>
          <Button>Yes</Button>
          <Button onClick={() => dispatch(closeModal())}>No</Button>
        </div>
      </div>
    </>
  );
}
