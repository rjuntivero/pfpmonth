'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setSelectedServerId } from '@/features/profileSlice';
import ProfilePanel from '../ProfilePanel/ProfilePanel';
import ServerCard from '@/components/profile/ServerPanel/ServerCard';
import styles from './ServerPanel.module.css';
import { useEffect } from 'react';
import { Server } from '@/lib/api/server/fetchServer';

export default function ServerPanel({ servers }: { servers: Server[] }) {
  const dispatch = useDispatch();
  const selectedServerId = useSelector((state: RootState) => state.profile.selectedServerId);

  useEffect(() => {
    if (!selectedServerId && servers.length > 0) {
      dispatch(setSelectedServerId(servers[0].server_id));
    }
  }, [dispatch, selectedServerId, servers]);

  return (
    <ProfilePanel heading="Servers" className={styles.serverPanel} contentClassName={styles.serverContent}>
      {servers.map((server) => (
        <ServerCard key={server.server_id} selected={server.server_id === selectedServerId} onClick={() => dispatch(setSelectedServerId(server.server_id))} imageURL={server.icon_url || '/no-image-placeholder.jpg'} serverName={server.name} />
      ))}
      <div className={styles.addServer}>
        <p>Add Server</p>
      </div>
    </ProfilePanel>
  );
}
