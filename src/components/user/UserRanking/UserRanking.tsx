import { GuildMember } from '@/types/User';
import styles from './UserRanking.module.css';
import Avatar from '../../shared/Avatar/Avatar';
import { motion } from 'framer-motion';
interface Props {
  member: GuildMember;
  index: number;
}

export default function UserRanking({ member, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      className={`${styles.container} ${!member?.user_id ? styles.newUser : ''}`}
    >
      <Avatar imageURL={member.discord_users.avatar_url} className={styles.avatar} />
      <div className={styles.info}>
        <h1>{member.discord_users.username}</h1>
        {/* {!member?.user_id ? <p>not yet participated</p> : ''} */}
        {!member?.user_id ? <p>No participation</p> : <p>2 day streak</p>}
      </div>
    </motion.div>
  );
}
