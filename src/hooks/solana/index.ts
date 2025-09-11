// PATH: src/hooks/solana/index.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Remove unused import 'PublicKey'
// - 'PublicKey' import removed (TS6133: declared but never used)
// - Only re-exports remain, batch fix grunge, filename/path éternel!

export { useConnection } from './useConnection'
export { useGetBalance } from './useGetBalance'
export { useGetSignatures } from '../useGetSignatures'
export { useGetTokenAccounts } from './useGetTokenAccounts'
export { useRequestAirdrop } from './useRequestAirdrop'
export { useTransferSol } from './useTransferSol'
export { useWrappedConnection } from './useWrappedConnection'
export { useSolanaClient } from './useSolanaClient'

// export const useSolanaWalletAddress = () => {
//  const { publicKey } = useWallet();
//  return publicKey?.toBase58();
// };

// PATCH NOTES:
// - Removed unused import 'PublicKey'
// - Filename/path éternel, matrix override, batch fix grunge!