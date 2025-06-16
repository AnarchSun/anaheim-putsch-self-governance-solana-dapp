// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import AnaheimIDL from '../target/idl/anaheim.json'
import type { Anaheim } from '../../anchor/target/types/anaheim'

export const ANAHEIM_PROGRAM_ID = new PublicKey(AnaheimIDL.address)

export function getAnaheimProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...AnaheimIDL, address: address?.toBase58() || AnaheimIDL.address } as Anaheim, provider)
}

export function getAnaheimProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet': {
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    }
    case 'testnet': {
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    }
    case 'mainnet-beta': {
      return ANAHEIM_PROGRAM_ID
    }
    default: {
      return ANAHEIM_PROGRAM_ID
    }
  }
}

export { type Anaheim } from '../../anchor/target/types/anaheim'
