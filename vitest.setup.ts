import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { Anaheim } from "./anchor/target/types/anaheim";
import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';
import path from 'path';

dotenv.config();

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Expose globally `program` and `anchor` for convenience in specs
declare global {
  var anchor: typeof import("@coral-xyz/anchor");
  var program: Program<Anaheim>;
}

global.program = anchor.workspace.Anaheim as Program<Anaheim>;
global.anchor = anchor;

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
    environment: 'node',
    setupFiles: './vitest.setup.ts',
  },
});

