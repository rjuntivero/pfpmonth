'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Dropdown.module.css';
import DropdownContent from './DropdownContent/DropdownContent';
import DropdownIcon from './DropdownIcon/DropdownIcon';

interface Props {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
  label?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export default function Dropdown({ items, selected, onSelect, label, isOpen, setIsOpen }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);

  const openState = isOpen ?? internalOpen;
  const toggleOpen = () => {
    if (setIsOpen) {
      setIsOpen(!openState);
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const handleSelect = (val: string) => {
    onSelect(val);
    if (setIsOpen) {
      setIsOpen(false);
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <div className={styles.dropdownContainer}>
      <button className={`${styles.filtersButton} ${openState ? styles.openDropdown : ''}`} onClick={toggleOpen}>
        {label || selected}
        <DropdownIcon />
      </button>

      <AnimatePresence>
        {openState && (
          <motion.div className={styles.dropdownWrapper} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <DropdownContent items={items} selected={selected} onSelect={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
