'use client';

import React, { ReactElement } from 'react';
import Button from '@/components/shared/Button/Button';
import BaseModal from '@/components/shared/Modal/BaseModal';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { closeModal, openModal } from '@/features/modalSlice';

interface ModalContentProps {
  closeModal: () => void;
}

interface Props {
  children?: React.ReactNode;
  modalContent: ReactElement<ModalContentProps>;
  modalClassName?: string;
}

export default function ButtonModalWrapper({ children, modalContent, modalClassName }: Props) {
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const dispatch = useAppDispatch();

  return (
    <>
      <Button variant="primary" onClick={() => dispatch(openModal())}>
        {children}
      </Button>
      <BaseModal isOpen={isOpen} onClose={() => dispatch(closeModal())} className={modalClassName}>
        {React.isValidElement(modalContent) ? React.cloneElement(modalContent, { closeModal: () => dispatch(closeModal()) }) : modalContent}
      </BaseModal>
    </>
  );
}
