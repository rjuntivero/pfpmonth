import styles from './page.module.css';
import { cookies } from 'next/headers';
import Avatar from '@/components/user/Avatar/Avatar';
import fetchUser from '@/lib/api/user/fetchUser';
import ProfilePanel from '@/components/layout/ProfilePanel/ProfilePanel';
import ServerCard from '@/components/server/ServerCard/ServerCard';
import CharacterCard from '@/components/character/CharacterCard/CharacterCard';
import Image from 'next/image';

export default async function Profile() {
  const currentYear = new Date().getFullYear();
  const serverId = (await cookies()).get('server_id')?.value;
  const { username, joined_at, avatar_url } = await fetchUser();
  // const { serverName, themes } = await fetchThemes(currentYear, serverId);
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
              <ProfilePanel heading="Servers" className={styles.servers} contentClassName={styles.serverLayout}>
                <ServerCard imageURL={'/naruto.jpg'} serverName={'server'} selected={true} />
                <ServerCard imageURL={'/naruto.jpg'} serverName={'server'} />
                <ServerCard imageURL={'/naruto.jpg'} serverName={'server'} />
                <ServerCard imageURL={'/naruto.jpg'} serverName={'server'} />
              </ProfilePanel>
            </div>
            <div className={`${styles.characterWrapper} ${styles.wrapper}`}>
              <ProfilePanel heading="Characters" className={styles.characters} contentClassName={styles.characterLayout}>
                <CharacterCard imageURL={'/naruto.jpg'} characterName={'finn the human'} selected={true} />
                <CharacterCard imageURL={'/naruto.jpg'} characterName={'finn the human'} />
                <CharacterCard imageURL={'/naruto.jpg'} characterName={'finn the human'} />
              </ProfilePanel>
            </div>
            <div className={`${styles.themeWrapper} ${styles.wrapper}`}>
              <ProfilePanel heading="Themes" className={styles.themes} contentClassName={styles.themesLayout}>
                <h1>
                  May <span>{currentYear}</span>
                </h1>
                <Image src={'/naruto.jpg' || '/no-image-placeholder.jpg'} alt="theme image" width={330} height={480} className={styles.themeImage} />
                <h2>Naruto</h2>
              </ProfilePanel>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
