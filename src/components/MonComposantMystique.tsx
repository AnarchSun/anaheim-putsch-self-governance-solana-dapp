import { useSolanaWalletAddressHook } from './../hooks/solana/'

export function MonComposantMystique() {
  const walletHookInstance = new useSolanaWalletAddressHook()
  const walletAddress = walletHookInstance.toString() // ou une méthode spécifique

  return (
    <div>
      <p>Adresse mystique: {walletAddress ?? 'Chargement...'}</p>
    </div>
  )
}
