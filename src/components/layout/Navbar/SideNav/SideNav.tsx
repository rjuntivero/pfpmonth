import { toggleNavbar } from '@/features/themeSlice';
import styles from './SideNav.module.css';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/state/hooks';
import { NavItem } from '@/types/NavItem';
import Link from 'next/link';
import { easeOut, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface Props {
  navItems: NavItem[];
}

export default function SideNav({ navItems }: Props) {
  const dispatch = useDispatch();
  const navbarOpen = useAppSelector((state) => state.theme.navbarOpen);
  const pathname = usePathname();

  function toggleSideNav() {
    dispatch(toggleNavbar(!navbarOpen));
  }

  return (
    <motion.div className={styles.wrapper} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ ease: easeOut, duration: 0.3 }}>
      <button onClick={toggleSideNav}></button>
      <div className={styles.content}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <li key={item.name} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Link href={item.path} onClick={toggleSideNav}>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
