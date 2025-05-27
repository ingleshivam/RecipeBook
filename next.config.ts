import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dwylojmkbggcdvus.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
}
export default nextConfig;
