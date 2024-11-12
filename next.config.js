/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['files.cdn.printful.com'], // Add your image domains here
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    PRINTFUL_API_KEY: process.env.PRINTFUL_API_KEY,
  },
}

module.exports = nextConfig 