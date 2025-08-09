import styles from './page.module.css';
import Avatar from '@/components/user/Avatar/Avatar';
import fetchUserData from '@/lib/api/user/fetchUserData';
import ProfilePanel from '@/components/profile/ProfilePanel/ProfilePanel';
import ServerCard from '@/components/server/ServerCard/ServerCard';
import CharacterCard from '@/components/character/CharacterCard/CharacterCard';
import { fetchCharacters } from '@/lib/api/user/characterActions';
import { requireAuth } from '@/lib/auth/requireAuth';
import { fetchServers } from '@/lib/api/server/fetchServer';
import ThemeSliderClientWrapper from '@/components/wrappers/ThemeSliderClientWrapper/ThemeSliderClientWrapper';
import { cookies } from 'next/headers';
import { fetchThemes } from '@/lib/api/theme/fetchThemes';
import ServerPanel from '@/components/profile/ServerPanel/ServerPanel';
import CharacterPanel from '@/components/profile/CharacterPanel/CharacterPanel';
import ThemePanel from '@/components/profile/ThemePanel/ThemePanel';

export default async function Profile() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const { themes } = await fetchThemes(currentYear, serverId);

  const { username, joined_at, avatar_url } = await fetchUserData();
  const characters = await fetchCharacters();
  const servers = await fetchServers();

  // ensure user is authenticated
  await requireAuth();

  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.profileWrapper}>
            <div className={styles.userWrapper}>
              <Avatar imageURL={avatar_url} className={styles.avatar} />
              <div className={styles.userInfo}>
                <h1 className={styles.username}>{username}</h1>
                <h2 className={styles.joinedAt}>joined: {joined_at}</h2>
              </div>
            </div>
            <div className={styles.milestoneWrapper}>
              <div className={`${styles.badgeWrapper} ${styles.wrapper}`}>
                <ProfilePanel className={styles.badges}>
                  <i>BADGE</i>
                  <i>BADGE</i>
                  <i>BADGE</i>
                  <i>BADGE</i>
                </ProfilePanel>
              </div>
              <div className={`${styles.timelineWrapper} ${styles.wrapper}`}>
                <ProfilePanel heading="Timeline" className={styles.timeline}>
                  <i>server</i>
                </ProfilePanel>
              </div>
            </div>
          </section>
          <section className={styles.infoWrapper}>
            <div className={`${styles.serverWrapper} ${styles.wrapper}`}>
              <ServerPanel servers={servers.serverNames} />
            </div>
            <div className={`${styles.characterWrapper} ${styles.wrapper}`}>
              <CharacterPanel characters={characters} />
            </div>
            <div className={`${styles.themeWrapper} ${styles.wrapper}`}>
              <ThemePanel heading="Themes" className={styles.themes} contentClassName={styles.themesLayout}>
                <ThemeSliderClientWrapper serverId={serverId as string} initialYear={currentYear} initialThemes={themes} />
              </ThemePanel>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
