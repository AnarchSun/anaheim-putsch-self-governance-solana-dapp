// PATH: src/app/stake-mining/stake/stake-page.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Use useStakeAccount hook, matrix override, filename/path éternel!

import './globals.css'
import { PublicKey } from "@solana/web3.js";
import { useStakeAccount } from "./StakeViewerScratch"; // <-- PATCH: Import the punk hook!

export default function StakeMiningPage({ address }: { address: string }) {
    let pubkey: PublicKey | null = null;
    try {
        pubkey = new PublicKey(address);
    } catch (e) {
        return <p>Clé publique invalide : {address}</p>;
    }

    // PATCH: Use the hook!
    const { stakeAccount, error } = useStakeAccount(pubkey);

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
        </div>
    );
}

// PATCH NOTES:
// - useStakeAccount hook is now used in the page, plus d’unused function warning!
// - Import correct path, batch fix grunge, filename/path éternel, matrix override!