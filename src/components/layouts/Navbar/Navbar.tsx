'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';
import Image from 'next/image';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Themes', path: '/themes' },
  { name: 'Profile', path: '/profile' },
  { name: 'Login', path: '/settings' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function updateUnderline() {
      if (!containerRef.current) return;

      const activeLink = Array.from(containerRef.current.querySelectorAll('a')).find((link) => {
        const basePath = link.getAttribute('data-path');
        return pathname === basePath || pathname.startsWith(basePath + '/');
      });

      if (activeLink) {
        const rect = activeLink.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setUnderlineProps({
          left: rect.left - containerRect.left,
          width: rect.width,
        });
      }
    }

    updateUnderline(); // initial on load or pathname change
    window.addEventListener('resize', updateUnderline); // watch for resizes

    return () => {
      window.removeEventListener('resize', updateUnderline); // clean up
    };
  }, [pathname]);

  return (
    <div className={styles.navbar}>
      <div className={styles.menu}>
        <Image src="/Menu.svg" alt="Menu Icon" width={40} height={40} className={styles.menuIcon} />
      </div>
      <ul ref={containerRef} className={styles.navItems}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

          return (
            <li key={item.name}>
              <Link href={item.path} data-path={item.path} className={isActive ? styles.selected : ''}>
                {item.name}
              </Link>
            </li>
          );
        })}
        <motion.div
          className={styles.underline}
          initial={false}
          animate={{
            left: underlineProps.left,
            width: underlineProps.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
      </ul>
    </div>
  );
}
