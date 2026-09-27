import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
      { protocol: "https", hostname: "img.itch.zone" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "user-images.githubusercontent.com" },
      { protocol: "https", hostname: "skillicons.dev" },
      { protocol: "https", hostname: "go-skill-icons.vercel.app" },
    ],
  },
};

export default nextConfig;

