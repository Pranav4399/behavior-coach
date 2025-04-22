import type { NextConfig } from "next";

/**
 * Allowed image domains and patterns for the application
 * This includes:
 * - Our backend domain for uploaded images
 * - Common placeholder services for development
 * - Common image hosting services
 * - Cloud storage services
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Backend uploads
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).hostname : 'localhost',
        pathname: '/uploads/**',
      },
      // Development placeholders
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Common image hosting services
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.imgur.com',
      },
      // Cloud storage
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      // Additional image hosting services
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Optional: Configure image sizes for optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
};

export default nextConfig;
