// packages/anchor-client/src/getAnaheimProgram.ts
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
<<<<<<< HEAD
import AnaheimIDL from '../../../anchor/target/idl/anaheim.json'
import type { Anaheim } from '../../../anchor/target/types/anaheim.ts'
=======
import AnaheimIDL from '../../../anchor/target/idl/anaheim-old.json'
import type { Anaheim } from '../../../anchor/target/types/anaheim-old'
>>>>>>> 8f8127adca63b1804a867654744d67c61c5dcd2d

export function getAnaheimProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program<Anaheim>(
    { ...AnaheimIDL, address: address?.toBase58() || AnaheimIDL.address },
    provider
  )
}
