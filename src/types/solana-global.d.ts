// PATH: src/types/solana-global.d.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Proper TypeScript global declaration, module export, batch fix eternal!
// Batch fix eternal: declare window.solanaWeb3 for browser global use!
import type * as solanaWeb3Type from '@solana/web3.js';

declare global {
    interface Window {
        solanaWeb3: typeof solanaWeb3Type;
    }
}