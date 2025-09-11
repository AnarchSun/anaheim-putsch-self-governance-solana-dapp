# PATH: docs/solana/heluis-rebate-punk-guide.md
# Helius Sender & Shred Delivery — Batch Fix, MEV Rebates, Punk DAO Guide

---

## **Révolte du DAO — MEV Rebates, Sender, et la Matrix Solana**
- **Shred Delivery**: accès ultra-rapide aux raw Solana data, punk grunge du data streaming.
- **Sender**: transaction sending optimisée, rebates automatiques, hack MEV sans risque toxique, lumière sur la matrice.

---

## **Batch Fix: Activer les Rebates sur Transactions Mainnet**

**Patch TypeScript/JavaScript:**
```typescript
// PATCH: Envoie une transaction avec rebate-address pour MEV rebates
const serializedTransaction = transaction.serialize().toString('base64');

const response = await fetch(
  `https://mainnet.helius-rpc.com/?api-key=${API_KEY}&rebate-address=${REBATE_ADDRESS}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'sendTransaction',
      params: [
        serializedTransaction,
        {
          skipPreflight: true,
          preflightCommitment: 'processed'
        }
      ]
    })
  }
);

const result = await response.json();
console.log('Transaction sent:', result.result);
console.log('Rebates will be paid to:', REBATE_ADDRESS);
```
- **Remplace** `${API_KEY}` et `${REBATE_ADDRESS}` par tes vraies valeurs.
- **Seulement sur Mainnet** — Devnet et batch RPC calls ne donnent pas de rebate.

---

## **Checklist Batch Fix Reality Hack**

1. **.env.local**
    - Mets ton endpoint mainnet Helius avec API key.
      ```env
      NEXT_PUBLIC_SOLANA_RPC_HOST=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
      ```
    - Ajoute le paramètre `rebate-address` lors des transactions.

2. **Helius Dashboard: Allowed Domains**
    - Ajoute ton domaine prod/dev dans "Allowed Domains" (anarcrypt.org, localhost, etc).

3. **Backend Proxy**
    - Pour toutes transactions, passe par un proxy backend pour cacher la clé API et ajouter le paramètre `rebate-address`.

4. **Frontend**
    - Le frontend demande la création de transaction au backend, signe, retourne au backend pour soumission et rebate.

5. **Restart Everything**
    - Redémarre tous les serveurs, purge le cache, relance le browser.
    - Teste sur domaine autorisé, jamais sur domaine non listé.

---

## **MEV Punk Lyric**
> Le putsch du DAO, le chaos ordonné,  
> Le Sender livre la transaction,  
> Le rebate jaillit de l’arbitrage,  
> La matrice s’ouvre sur le profit collectif,  
> L’anarchiste gagne, le capitaliste pleure,  
> La lumière du MEV éclaire le chemin.

---

## **FAQ punk grunge**

- **Devnet vs Mainnet**: Rebates = Mainnet only.
- **Batch RPC**: Rebates = single sendTransaction only.
- **Domaines non autorisés**: 403 direct, patch via dashboard.
- **Backend proxy**: Toujours proxy pour la sécurité et le rebate.
- **Redémarrage**: Obligatoire après toute modif .env ou dashboard.

---

**Feed me next error, fichier, config, log pour batch fix.  
DAO, punk, grunge, matrix override, miroir de vérité, always.**