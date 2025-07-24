'use client';

import React from 'react';
import Button from '@/components/shared/Button/Button';
import BaseModal from '@/components/shared/Modal/BaseModal';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { closeModal, openModal } from '@/features/modalSlice';

interface Props {
  children?: React.ReactNode;
  buttonText: string;
  modalClassName?: string;
}

export default function ButtonModalWrapper({ children, buttonText, modalClassName }: Props) {
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const dispatch = useAppDispatch();

  return (
    <>
      <Button variant="primary" onClick={() => dispatch(openModal())}>
        {buttonText}
      </Button>
      <BaseModal isOpen={isOpen} onClose={() => dispatch(closeModal())} className={modalClassName}>
        {children}
      </BaseModal>
    </>
  );
}
