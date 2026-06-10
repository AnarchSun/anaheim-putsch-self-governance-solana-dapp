import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {}, // 👈 IMPORTANT: avoids boolean crash

  webpack: (config) => {
    config.resolve.extensions = [".ts", ".tsx", ".js", ".json"];

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [
        path.resolve(__dirname, "node_modules/gill-monorepo"),
        path.resolve(
          __dirname,
          "node_modules/.pnpm/gill-monorepo*/node_modules/gill-monorepo"
        ),
      ],
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel", "@babel/preset-typescript"],
        },
      },
    });

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };

    return config;
  },
};

export default nextConfig;