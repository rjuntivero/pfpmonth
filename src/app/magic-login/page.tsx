import { redirect } from 'next/navigation';

interface SearchParams {
  searchParams: {
    discord_id?: string;
    token?: string;
  };
}

export default async function MagicLoginPage({ searchParams }: SearchParams) {
  const discord_id = searchParams.discord_id?.trim();
  const token = searchParams.token?.trim();

  if (!discord_id || !token) {
    return (
      <main className="">
        <h1>Invalid login link.</h1>
      </main>
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/magic-login/api`, {
    method: 'POST',
    body: JSON.stringify({ discord_id, token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.ok) {
    redirect('/');
  }

  return (
    <main className="">
      <h1>Invalid or expired link.</h1>
    </main>
  );
}
