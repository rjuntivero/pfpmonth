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
  label?: string; // button label
}

export default function Dropdown({ items, selected, onSelect, label }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val: string) => {
    onSelect(val);
    setOpen(false);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button className={`${styles.filtersButton} ${open ? styles.openDropdown : ''}`} onClick={() => setOpen((prev) => !prev)}>
        {label || selected}
        <DropdownIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className={styles.dropdownWrapper} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <DropdownContent items={items} selected={selected} onSelect={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
