// FILE: next.config.ts
import type { NextConfig } from 'next'

// All of your configuration is defined in this single object.
const nextConfig: NextConfig = {
    // This is the modern, correct way to transpile packages.
    // The old `next-transpile-modules` is no longer needed.
    transpilePackages: ["salmon-adapter-sdk"],

    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '1mb',
            allowedOrigins: ['https://anarcrypt.sol']
        }
    },

    // Your webpack configuration to handle the 'fs' module is correct.
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

// This is the correct way to export the configuration in a TypeScript file.
export default nextConfig;