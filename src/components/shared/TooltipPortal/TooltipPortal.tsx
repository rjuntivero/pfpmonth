'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './TooltipPortal.module.css';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  position: { x: number; y: number };
}

export default function TooltipPortal({ children, position }: Props) {
  const [mounted, setMounted] = useState(false);
  const [container] = useState(() => document.createElement('div'));
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    document.body.appendChild(container);
    setMounted(true);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  // Adjust position so bottom-center aligns with the cursor
  useEffect(() => {
    if (tooltipRef.current) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setAdjustedPos({
        left: position.x - offsetWidth / 2,
        top: position.y - offsetHeight,
      });
    }
  }, [position]);

  return mounted
    ? createPortal(
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.3 }}
          style={{
            position: 'fixed',
            top: adjustedPos.top,
            left: adjustedPos.left,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className={styles.tooltip}
        >
          {children}
        </motion.div>,
        container
      )
    : null;
}
