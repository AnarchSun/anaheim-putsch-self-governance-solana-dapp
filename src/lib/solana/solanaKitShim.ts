// PATH: src/lib/solana/solanaKitShim.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Remove unused interface IAccountMeta, batch fix grunge, filename/path éternel!

// Types nominales pour imprégner le typage fort
export type Address = string & { __brand: 'Address' }  // La marque doit être obligatoire pour valider la nominalité

// PATCH: Removed unused interface IAccountMeta

// Classe "getter" pour URL RPC selon cluster
export class getPublicSolanaRpcUrl {
  private readonly cluster: string

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

// PATCH NOTES:
// - Removed unused interface IAccountMeta
// - Filename/path éternel, batch fix grunge!