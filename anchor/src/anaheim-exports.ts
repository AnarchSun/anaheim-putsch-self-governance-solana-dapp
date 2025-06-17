// anchor/src/anaheim-exports.ts
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '../../node_modules/@solana/kit'
import AnaheimIDL from '../target/idl/anaheim.json'
import type { Anaheim } from '../../anchor/target/types/anaheim'


export const ANAHEIM_PROGRAM_ID = new PublicKey(AnaheimIDL.address)

export function getAnaheimProgramId(cluster: Cluster): PublicKey {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ANAHEIM_PROGRAM_ID
  }
}

export const ANAHEIM_PROGRAM_ID = new PublicKey(AnaheimIDL.address)

export function getAnaheimProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...AnaheimIDL, address: address?.toBase58() || AnaheimIDL.address } as Anaheim, provider)
}

class ClusterUi {
}

export function getAnaheimProgramId(cluster: ClusterUi) {
  if (ClusterUi === 'devnet') {
    {
      return new PublicKey ( 'coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF' )
    }
  }
  if (ClusterUi === 'testnet') {
    {
      return new PublicKey ( 'coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF' )
    }
  } else if (ClusterUi === 'mainnet-beta') {
    {
      return ANAHEIM_PROGRAM_ID
    }
  } else {
    {
      return ANAHEIM_PROGRAM_ID
    }
  }
}

export { type Anaheim } from '../../anchor/target/types/anaheim'
