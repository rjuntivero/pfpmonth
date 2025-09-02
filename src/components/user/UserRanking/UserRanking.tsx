import { GuildMemberRank } from '@/types/User';
import styles from './UserRanking.module.css';
import Avatar from '../../shared/Avatar/Avatar';
import { motion } from 'framer-motion';
interface Props {
  member: GuildMemberRank;
  index: number;
  score?: number;
  rankingType?: 'All Time' | 'Monthly';
}

export default function UserRanking({ member, index, score, rankingType }: Props) {
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
        {rankingType === 'All Time' ? !member?.user_id ? <p>User has not logged in</p> : score ?? 0 < 1 ? <p>No participation</p> : <p>{score} month streak</p> : ''}
        {rankingType === 'Monthly' ? (
          !member?.user_id ? (
            <p>User has not logged in</p>
          ) : !member?.participated ? (
            <p>No participation</p>
          ) : (
            <p>
              joined{' '}
              {member.fastestTime
                ? new Date(member.fastestTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })
                : ''}
            </p>
          )
        ) : (
          ''
        )}
      </div>
    </motion.div>
  );
}
