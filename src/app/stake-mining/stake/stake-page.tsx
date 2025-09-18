// Path: src/app/stake-mining/stake/stake-page.tsx
import './globals.css'
import { PublicKey } from "@solana/web3.js";
import { useStakeAccount } from "./StakeViewerScratch";
import { useStakeMutation } from "@/hooks/stake/useStakeMutation"; // Ajout de l'import

export default function StakeMiningPage({ address }: { address: string }) {
    let pubkey: PublicKey | undefined = undefined;
    let invalidAddress = false;

    try {
        pubkey = new PublicKey(address);
    } catch {
        invalidAddress = true;
    }

    const { stakeAccount, error } = useStakeAccount(pubkey);
    const { createStake } = useStakeMutation(); // Utilisation du hook

    if (invalidAddress) {
        return <p>Clé publique invalide&nbsp;: {address}</p>;
    }

    return (
      <div>
          <h2>Compte Stake</h2>
          {error && <div className="text-red-500">Erreur: {error}</div>}
          {!stakeAccount && !error && <p>Chargement du compte de stake...</p>}
          {stakeAccount && (
            <div>
                <p>Activation Epoch: {stakeAccount.activationEpoch}</p>
                <p>Delegated Stake: {stakeAccount.delegatedStake}</p>
            </div>
          )}
          <button onClick={createStake} className="btn">
              Créer un compte de stake
          </button>
      </div>
    );
}
