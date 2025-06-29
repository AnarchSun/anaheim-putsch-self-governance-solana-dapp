import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Anaheim } from '../anchor/target/@types/anaheim'

const provider = anchor.AnchorProvider.env()
anchor.setProvider(provider)

const program = anchor.workspace.Anaheim as Program<Anaheim>

describe('Anaheim interact test', () => {
  it('Crée un post', async () => {
    // Mocks
    const postAccount = Keypair.generate()
    const user = Keypair.generate()

    // Ici on peut await car on est dans une fonction async
    const tx = await program.methods
      .createPost('hello world post')
      .accounts({
        postAccount: postAccount.publicKey,
        user: user.publicKey,
      })
      .signers([user, postAccount])
      .rpc()

    console.log('✅ TX envoyé :', tx)

    // Optionnel : on peut vérifier l’état du compte
    const accountData = await program.account.postAccount.fetch(postAccount.publicKey)
    expect(accountData.content.toString()).toContain('hello world post')
  })
})
