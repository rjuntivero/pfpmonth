import { redirect } from 'next/navigation';

interface SearchParams {
  searchParams: {
    discord_id?: string;
    token?: string;
    username?: string;
    avatar_url?: string;
    server_id?: string;
    server_name?: string;
    server_icon?: string;
  };
}

export default async function MagicLogin({ searchParams }: SearchParams) {
  const discord_id = searchParams.discord_id?.trim();
  const token = searchParams.token?.trim();
  const username = searchParams.username?.trim();
  const avatar_url = searchParams.avatar_url?.trim();
  const server_id = searchParams.server_id?.trim();
  const server_name = searchParams.server_name?.trim();
  const server_icon = searchParams.server_icon?.trim();

  if (!discord_id || !token) {
    return (
      <main className="">
        <h1>Invalid login link.</h1>
      </main>
    );
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/magic-login/api`, {
    method: 'POST',
    body: JSON.stringify({ discord_id, token, username, avatar_url, server_id, server_name, server_icon }),
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
