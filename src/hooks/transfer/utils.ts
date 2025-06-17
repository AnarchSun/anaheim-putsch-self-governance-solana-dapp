// Fonction utilitaire d’envoi de transaction (mock ou vrai)
export async function sendTransferTransaction(to: string, amount: number): Promise<string> {
  // Ici tu implémentes la logique RPC, Solana, ancrage, etc.
  // Exemple fictif :
  console.log(`Envoi de ${amount} à ${to}`);
  // Simule signature de tx
  return Promise.resolve('fakeTxSignature1234567890');
}
