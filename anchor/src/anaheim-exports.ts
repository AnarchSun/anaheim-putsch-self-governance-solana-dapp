// File: src/hooks/useAnaheimProgram.ts
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { AnchorProvider } from '@coral-xyz/anchor'
import {getAnaheimProgram} from "../../packages/anchor-client/src/getAnaheimProgram";


export function useAnaheimProgram() {
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  if (!wallet) return null

  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })

  return getAnaheimProgram(provider)
}
