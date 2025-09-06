import type { NextConfig } from 'next'

// 🏴‍☠️ BATCH FIX: Add gill-monorepo to transpilePackages for TypeScript/JSX in node_modules
// This ensures Next.js will transpile Gill's raw .ts/.tsx code for you, fixing build errors!

const nextConfig: NextConfig = {
    // Transpile both your Solana SDK and Gill monorepo (add more as needed!)
    transpilePackages: ["salmon-adapter-sdk", "gill-monorepo"],

    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '1mb',
            allowedOrigins: ['https://anarcrypt.sol']
        }
    },

    webpack(config, { isServer }) {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    }
};

export default nextConfig;