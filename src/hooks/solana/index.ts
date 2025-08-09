// src/hooks/solana/index.ts

import {PublicKey} from "@solana/web3.js";

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

// ...

// Supprime cette fonction vide qui crée le problème
// export function useWallet() {
//   // TODO ORION
// }
export class useSolanaWalletAddressHook {
    async getAccountInfo(addressSyncElement: PublicKey) {

    }
}