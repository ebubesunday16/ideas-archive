import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

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

    })

    // Add this block:
  config.ignoreWarnings = [
    (warning) =>
      typeof warning.message === 'string' &&
      (
        warning.message.includes("Can't resolve './ladywithLaptop.svg'") ||
        warning.message.includes("Can't resolve '@/components/IdeaContainer'")
      )
  ];

    return config;
  },


 async redirects(){
  return [
    {
      source: '/',
      destination: '/ideas',
      permanent: true,      
    },
  ]
 }


};

export default nextConfig;
