import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  // Expose Judge0 key only on the server
  env: {
    JUDGE0_API_KEY: process.env.JUDGE0_API_KEY ?? '',
  },
}

export default nextConfig