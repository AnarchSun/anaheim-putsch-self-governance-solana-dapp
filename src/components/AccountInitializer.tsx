// PATH: src/components/AccountInitializer.tsx
// Anaheim DAO — Composant d’init unique avec hook unifié

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useAnaheimInitialize } from '@/hooks/useAnaheimInitialize';

export function AccountInitializer() {
    const { publicKey, connected } = useWallet();
    const pubkey = publicKey?.toBase58();
    const { loading, accountInfo, error, fetchAccount, initialize } = useAnaheimInitialize(pubkey);

    useEffect(() => {
        if (connected && pubkey) fetchAccount();
    }, [connected, pubkey, fetchAccount]);

    if (!pubkey) return <p>Connecte ton wallet Phantom pour initialiser ton compte Anaheim!</p>;
    if (loading) return <p>Chargement du compte Anaheim...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!accountInfo) {
        return (
            <button
                onClick={initialize}
                style={{
                    cursor: 'pointer',
                    padding: '16px 32px',
                    fontSize: '1.2rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg,#df2d4f,#fccb06 80%)',
                    color: '#222',
                    fontWeight: 900,
                    border: '3px solid #df2d4f',
                    boxShadow: '0 4px 16px #df2d4f66',
                    margin: '32px auto',
                    display: 'block',
                    transition: 'background 0.2s, box-shadow 0.2s',
                }}
            >
                Initialiser mon compte Anaheim
            </button>
        );
    }
    return (
        <div style={{margin: '32px auto', textAlign: 'center', fontWeight: 700, color: "#228b22"}}>
            Compte Anaheim initialisé!
        </div>
    );
}