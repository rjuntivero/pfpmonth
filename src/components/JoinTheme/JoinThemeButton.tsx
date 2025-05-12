'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import JoinTransition from './JoinTransition';

export default function JoinThemeButton({ imageUrl, children }: { imageUrl: string; children: React.ReactNode }) {
  const [joining, setJoining] = useState(false);
  const router = useRouter();

  return (
    <>
      <button onClick={() => setJoining(true)}>{children}</button>
      <JoinTransition trigger={joining} imageUrl={imageUrl} onComplete={() => router.push('/upload')} />
    </>
  );
}
