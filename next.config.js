/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    PLANETSCALE_DATABASE_URL: process.env.PLANETSCALE_DATABASE_URL,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
