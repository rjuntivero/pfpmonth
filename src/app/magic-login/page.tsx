// app/magic-login/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MagicLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const discordId = searchParams.get('discord_id')?.trim();
  const token = searchParams.get('token')?.trim();

  const [status, setStatus] = useState('Logging you in...');

  useEffect(() => {
    async function login() {
      if (!discordId || !token) {
        setStatus('Invalid login link.');
        return;
      }

      const res = await fetch('/magic-login/api', {
        method: 'POST',
        body: JSON.stringify({ discord_id: discordId, token }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.replace('/');
      } else {
        setStatus('Invalid or expired link.');
      }
    }

    login();
  }, [discordId, token, router]);

  return (
    <main className="p-8 text-center">
      <h1>{status}</h1>
    </main>
  );
}
