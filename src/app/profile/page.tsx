import { fetchThemesAndServer } from '@/lib/api/theme/fetchThemes';
import styles from './page.module.css';
import { cookies } from 'next/headers';
import ThemeSlider from '@/components/theme/ThemeSlider/ThemeSlider';
import Avatar from '@/components/user/Avatar/Avatar';
import fetchUser from '@/lib/fetchUser';
import ProfilePanel from '@/components/layout/ProfilePanel/ProfilePanel';

export default async function Profile() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const { username, joined_at, avatar_url } = await fetchUser();
  // const { serverName, themes } = await fetchThemesAndServer(currentYear, serverId);
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
              <div className={styles.badgeWrapper}>
                <ProfilePanel className={styles.badges}>
                  <i>BADGE</i>
                  <i>BADGE</i>
                  <i>BADGE</i>
                  <i>BADGE</i>
                </ProfilePanel>
              </div>
              <div className={styles.timelineWrapper}>
                <h1>Timeline</h1>
                <li>May</li>
              </div>
            </div>
          </section>
          <section className={styles.infoWrapper}>
            <div className={styles.serverWrapper}>
              <ProfilePanel heading="Servers" className={styles.servers}>
                <i>server</i>
                <i>server</i>
                <i>server</i>
                <i>server</i>
              </ProfilePanel>
            </div>
            <div className={styles.characterWrapper}>
              <ProfilePanel heading="Characters" className={styles.characters}>
                <i>server</i>
                <i>server</i>
                <i>server</i>
                <i>server</i>
              </ProfilePanel>
            </div>
            <div className={styles.themeWrapper}>
              <ProfilePanel heading="Themes" className={styles.themes}>
                <i>server</i>
                <i>server</i>
                <i>server</i>
                <i>server</i>
              </ProfilePanel>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
