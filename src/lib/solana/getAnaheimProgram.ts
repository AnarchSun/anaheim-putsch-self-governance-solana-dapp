// lib/solana/getAnaheimProgram.ts
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Connection } from '@solana/web3.js'
import AnaheimIDL from '@/../anchor/target/idl/anaheim.json'
import { dummyWallet } from '@/lib/solana/dummyWallet'

const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

export const provider = new AnchorProvider(connection, dummyWallet, AnchorProvider.defaultOptions())

export const program = new Program(AnaheimIDL as any, provider)
export function useAnaheimProgram() {
  const wallet = useAnchorWallet() // peut être undefined au début

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

  if (!wallet) {
    throw new Error("Wallet not connected") // ou gère l'absence différemment
  }

  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())

  return new Program ( AnaheimIDL as any, provider )
}
