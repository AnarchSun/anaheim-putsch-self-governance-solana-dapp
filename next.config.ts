import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}
module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  rules: {
    // règles custom
  }
}
export default nextConfig
