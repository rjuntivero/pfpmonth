export default function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return;

  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}
