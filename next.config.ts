import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],

    })
    return config;
  },

  typescript: {
   
    ignoreBuildErrors: true,
  },

  eslint: {

    ignoreDuringBuilds: true,
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
