
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-studio-1748582697911.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev',
      // আপনি যদি অন্য কোনো লোকাল ডেভেলপমেন্ট টুলের প্রিভিউ ব্যবহার করেন, 
      // তাহলে সেগুলোও এখানে যোগ করতে পারেন, যেমন: 'http://localhost:XXXX'
    ],
  },
};

export default nextConfig;
