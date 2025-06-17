// packages/anchor-client/src/index.ts
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'

interface AnchorClient {
  idl: Idl
  programId: string
  provider: AnchorProvider
}

export function createAnchorClient({idl, provider}: AnchorClient) {
  return new Program ( idl, provider )
}
