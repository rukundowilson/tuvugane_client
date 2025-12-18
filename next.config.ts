import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Use localhost:5000/api in development, otherwise use environment variable or production URL
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api' 
        : 'https://tuvugane-server.onrender.com/api'),
  },
};

export default nextConfig;
