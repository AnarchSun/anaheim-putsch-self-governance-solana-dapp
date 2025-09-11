// PATH: lib/solana/getAnaheimProgram.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Import endpoint from config, no hardcode, filename/path éternel! Batch fix grunge!

import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Connection } from '@solana/web3.js'
import AnaheimIDL from '@/../anchor/target/idl/anaheim.json'
import { dummyWallet } from '@/lib/solana/dummyWallet'
import { SOLANA_CLUSTER_URL } from '@/config/solana' // Punk override: get endpoint from config!

const connection = new Connection(SOLANA_CLUSTER_URL, 'confirmed')

export const provider = new AnchorProvider(connection, dummyWallet, AnchorProvider.defaultOptions())

export const program = new Program(AnaheimIDL as any, provider)

export function useAnaheimProgram() {
  const wallet = useAnchorWallet() // peut être undefined au début

  const connection = new Connection(SOLANA_CLUSTER_URL, 'confirmed')

  if (!wallet) {
    throw new Error("Wallet not connected") // ou gère l'absence différemment
  }

  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())

  return new Program(AnaheimIDL as any, provider)
}

// PATCH NOTES:
// - Connection always uses SOLANA_CLUSTER_URL from config, no hardcoded endpoint!
// - Change endpoint in src/config/solana.ts or .env, never here.
// - Batch fix grunge, filename/path éternel, DAO override!