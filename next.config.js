/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['files.cdn.printful.com'],
  },
  transpilePackages: ['gsap']
}

module.exports = nextConfig 