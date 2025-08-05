import { GuildMember } from '@/types/User';
import styles from './UserRanking.module.css';
import Avatar from '../Avatar/Avatar';

interface Props {
  member: GuildMember;
}

export default function UserRanking({ member }: Props) {
  return (
    <div className={`${styles.container} ${!member?.user_id ? styles.newUser : ''}`}>
      <Avatar imageURL={member.discord_users.avatar_url} className={styles.avatar} />
      <h1>{member.discord_users.username}</h1>
      {/* {!member?.user_id ? <p>not yet participated</p> : ''} */}
      <p>2 day streak</p>
    </div>
  );
}
