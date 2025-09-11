// PATH: src/types/solana-global.d.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Proper TypeScript global declaration, module export, batch fix eternal!

export {}

declare global {
    interface Window {
        solanaWeb3?: typeof import('@solana/web3.js');
    }
}