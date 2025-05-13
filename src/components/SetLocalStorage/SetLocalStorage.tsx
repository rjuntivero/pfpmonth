'use client';

import { useEffect } from 'react';

interface Props {
  data: {
    username: string;
    avatar_url: string;
    server_name: string;
    server_icon: string;
  };
}

export default function SetLocalStorage({ data }: Props) {
  useEffect(() => {
    if (!data) return;
    localStorage.setItem('username', data.username);
    localStorage.setItem('avatar_url', data.avatar_url);
    localStorage.setItem('server_name', data.server_name);
    localStorage.setItem('server_icon', data.server_icon);
  }, [data]);

  return null;
}
