'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Navbar.module.css';
import Image from 'next/image';
import { useAppSelector } from '@/state/hooks';
import { useDispatch } from 'react-redux';
import SideNav from './SideNav/SideNav';
import { toggleNavbar } from '@/features/themeSlice';
import { NavItem } from '@/types/NavItem';

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Themes', path: '/themes' },
  { name: 'Profile', path: '/profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLUListElement>(null);
  const navbarOpen = useAppSelector((state) => state.theme.navbarOpen);
  const dispatch = useDispatch();

  function toggleSideNav() {
    dispatch(toggleNavbar(!navbarOpen));
  }

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

    // initial on load or pathname change
    updateUnderline();
    // watch for resizes
    window.addEventListener('resize', updateUnderline);

    // clean up
    return () => {
      window.removeEventListener('resize', updateUnderline);
    };
  }, [pathname]);

  return (
    <>
      <AnimatePresence>{navbarOpen && <SideNav navItems={navItems} />}</AnimatePresence>
      <nav className={styles.navbar}>
        <button onClick={toggleSideNav} type="button" aria-label="Open menu" className={styles.menu}>
          <Image src="/Menu.svg" alt="Menu Icon" width={40} height={40} className={styles.menuIcon} />
        </button>

        <ul ref={containerRef} className={styles.navItems}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <li key={item.name}>
                <Link aria-current={isActive ? 'page' : undefined} href={item.path} data-path={item.path} className={isActive ? styles.selected : ''}>
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
      </nav>
    </>
  );
}
