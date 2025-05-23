import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  

  images: {
    domains: ['i.imgur.com', 'imagur.com', 'substackcdn.com'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  
};

export default nextConfig;