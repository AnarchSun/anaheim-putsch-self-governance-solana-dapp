// packages/anchor-client/src/getAnaheimProgram.ts
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import type { Anaheim } from '../../../anchor/target/types/anaheim.ts'
import AnaheimIDL from '../../../anchor/target/idl/anaheim.json'

export function getAnaheimProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program<Anaheim>(
    { ...AnaheimIDL, address: address?.toBase58() || AnaheimIDL.address },
    provider
  )
}
