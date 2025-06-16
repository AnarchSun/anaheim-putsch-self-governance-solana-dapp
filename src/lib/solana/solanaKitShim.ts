// Types nominales pour imprégner le typage fort
export type Address = string & { __brand: 'Address' }  // La marque doit être obligatoire pour valider la nominalité

export interface IAccountMeta {
  address: Address
  isSigner: boolean
  isWritable: boolean
  role?: string  // facultatif, reste libre
}

export interface IInstruction<Accounts extends IAccountMeta[] = IAccountMeta[]> {
  programAddress: string
  data: Buffer
  accounts: Accounts
}

// Marquage fort d'une string en Address
export function toAddress(addr: string): Address {
  return addr as Address
}

// Classe "getter" pour URL RPC selon cluster
export class getPublicSolanaRpcUrl {
  private cluster: string

  constructor(cluster: string) {
    this.cluster = cluster
  }

  get url(): string {
    switch (this.cluster) {
      case 'devnet':
        return 'https://api.devnet.solana.com'
      case 'testnet':
        return 'https://api.testnet.solana.com'
      case 'mainnet-beta':
        return 'https://api.mainnet-beta.solana.com'
      default:
        throw new Error(`Cluster inconnu: ${this.cluster}`)
    }
  }

  toString(): string {
    return this.url
  }
}
