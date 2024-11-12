/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['files.cdn.printful.com'],
  },
  webpack: (config, { isServer }) => {
    // Add GSAP to the transpiled modules
    config.module.rules.push({
      test: /gsap.*\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      }],
    });

    return config;
  },
}

module.exports = nextConfig 