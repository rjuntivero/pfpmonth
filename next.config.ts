import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['rngrngeyegzlrumwproy.supabase.co', 'cdn.discordapp.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
