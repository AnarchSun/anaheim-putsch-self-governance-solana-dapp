import { defineConfig } from 'vitest/config';
import path from 'path';

// Export principal
export default defineConfig({
  resolve: {
    alias: {
      '@wallet-ui/react': path.resolve(__dirname, './components/wallet/wallet_context.tsx'),
      '@': path.resolve(__dirname, './'),
      '@idl': path.resolve(__dirname, './idl'),
    },
  },
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
    include: [
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
      'test/**/*.test.ts',
      'test/**/*.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
    testTimeout: 30000,
  },
});
