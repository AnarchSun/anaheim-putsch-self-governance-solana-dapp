// anchor/src/anaheim-exports.ts
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import AnaheimIDL from '../target/idl/anaheim.json'
import type { Anaheim } from '../target/types/anaheim'
import { PublicKey } from '@solana/web3.js'

export const ANAHEIM_PROGRAM_ID = new PublicKey(AnaheimIDL.address)

export function getAnaheimProgramId(cluster: any): PublicKey {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ANAHEIM_PROGRAM_ID
  }
}

export function getAnaheimProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program(
    { ...AnaheimIDL, address: address?.toBase58() || AnaheimIDL.address } as Anaheim,
    provider
  )
}
