import { Connection, PublicKey } from '@solana/web3.js'
// Supprime cette ligne si tu ne l'utilises pas dans ce fichier
// import { useStakeActivationSafe } from '@/hooks/stake/useStakeActivationSafe'

export class getStakeActivationSafe {
  public state = {
    state: 'unknown',
    active: 0,
    inactive: 0,
  }

  private readonly connection: Connection
  private readonly pubkey: PublicKey

  constructor(connection: Connection, pubkey: PublicKey) {
    this.connection = connection
    this.pubkey = pubkey
  }

  async fetch() {
    const pubkeyStr = this.pubkey.toBase58()
    console.log('Fetching stake info for:', pubkeyStr)

    const accountInfo = await this.connection.getAccountInfo(this.pubkey)

    if (accountInfo?.data) {
      // Ici, tu feras ton décodage réel
      this.state = {
        state: 'active',
        active: 100,
        inactive: 0,
      }
    } else {
      this.state = {
        state: 'inactive',
        active: 0,
        inactive: 0,
      }
    }
  }
}
