// lib/solana/getAnaheimProgram.ts
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { AnaheimIDL } from '../../../anchor/idl/anaheim'
import { Connection, PublicKey } from '@solana/web3.js'

export function getAnaheimProgram(connection: Connection, wallet: Wallet) {
  const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' })
  return new Program(AnaheimIDL as any, new PublicKey(AnaheimIDL.metadata.address), provider)
}
