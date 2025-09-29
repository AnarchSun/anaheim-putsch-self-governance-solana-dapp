import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'anchor': path.resolve(__dirname, 'anchor'),
      '@anaheim/anchor-client': path.resolve(__dirname, 'packages/anchor-client/src'),
      '@stake-lib': path.resolve(__dirname, 'eco-subsystem/complementary-modules/getStakeActivation/js/src'),
      '@vendor': path.resolve(__dirname, 'vendor'),
    },
  },
});