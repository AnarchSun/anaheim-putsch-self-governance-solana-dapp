import AccountListFeature from '@/components/account/account-list-feature'
import { CreateTransaction } from '@/components/account/createTransaction'
import { AccountUI } from '@/components/account/account-ui.txs'
import { PublicKey } from '@solana/web3.js'

export default function Page() {
  // Ici tu passes les props address et account nécessaires au composant
  const address = 'Faisici ton adresse Solana ici'
  const account = new PublicKey(address)

  return (
    <>
      <AccountListFeature />
      <CreateTransaction recipientAddress={''} />
      <AccountUI address={address} account={account} />
    </>
  )
}
