import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized : true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dwylojmkbggcdvus.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },  
}
export default nextConfig;
