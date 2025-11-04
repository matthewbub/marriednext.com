import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "q8a0jhjw1u.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "w5z4pkjtzs.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
