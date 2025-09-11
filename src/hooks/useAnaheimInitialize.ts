// PATH: src/hooks/useAnaheimInitialize.ts
// Anaheim DAO — Hook unique pour initialiser le compte Anaheim

import { useState, useCallback } from 'react';
import { initializeAccount, getAccountInfo } from '@/app/api/accountApi'; // update path if needed

export function useAnaheimInitialize(pubkey?: string) {
    const [loading, setLoading] = useState(false);
    const [accountInfo, setAccountInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchAccount = useCallback(() => {
        if (!pubkey) return;
        setLoading(true);
        setError(null);
        getAccountInfo(pubkey)
            .then(info => {
                setAccountInfo(info);
                setLoading(false);
            })
            .catch(err => {
                setError('Erreur: ' + err?.message);
                setLoading(false);
            });
    }, [pubkey]);

    const initialize = useCallback(async () => {
        if (!pubkey) return;
        setLoading(true);
        setError(null);
        try {
            await initializeAccount(pubkey);
            fetchAccount();
        } catch (err: any) {
            setError('Erreur d’init: ' + (err?.message || 'Unknown'));
            setLoading(false);
        }
    }, [pubkey, fetchAccount]);

    return { loading, accountInfo, error, fetchAccount, initialize };
}