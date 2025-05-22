import { fetchThemesAndServer } from '@/lib/fetchThemes';
import styles from './page.module.css';
import { cookies } from 'next/headers';
import ThemeSlider from '@/components/ui/Theme/ThemeSlider/ThemeSlider';
import Avatar from '@/components/ui/User/Avatar/Avatar';
import fetchUser from '@/lib/fetchUser';
import ProfilePanel from '@/components/layouts/ProfilePanel/ProfilePanel';

export default async function Profile() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const { username, joined_at, avatar_url } = await fetchUser();
  const { serverName, themes } = await fetchThemesAndServer(currentYear, serverId);
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.wrapper}>
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
          <section className={styles.wrapper}>
            <div className={styles.serverWrapper}></div>
            <div className={styles.pfpWrapper}>
              <div className={styles.characterWrapper}></div>
              <div className={styles.themeWrapper}></div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
