// clients/js/src/TODO.md

# TODO – JS Client SDK

## Scope
Ce fichier suit l’avancement du client JS/TS (`clients/js/src`).  
Il centralise les modules de connexion et d’intégration utilisés par l’Orion dApp.

---

## Modules principaux

- [ ] **Connection & Config**
    - `clients/js/src/config.ts`
    - Lire `.env` / cluster configs
    - Exporter endpoints (RPC, programId)

- [ ] **Wallet integration**
    - `clients/js/src/wallet.ts`
    - Connecter Phantom / Solflare
    - Gestion des transactions signées

- [ ] **Staking client**
    - `clients/js/src/staking.ts`
    - Bindings vers Anchor program `staking.rs`
    - Fonctions : `createStakeAccount`, `lockStake`, `withdrawRewards`

- [ ] **Rewards client**
    - `clients/js/src/rewards.ts`
    - Bindings vers Anchor program `rewards.rs`
    - Calculer et récupérer récompenses

- [ ] **Governance client**
    - `clients/js/src/governance.ts`
    - Intégrer Realms SDK
    - Proposals, votes, trésorerie

- [ ] **NFT client**
    - `clients/js/src/nft.ts`
    - Fetch metadata
    - Mint / buy flow (hors Candy Machine)

- [ ] **Analytics client**
    - `clients/js/src/analytics.ts`
    - Extraire données depuis worker logs (`data/fixes.json`)
    - Préparer pour UI

---

## Notes (Worker)
- Chaque fois qu’un import non résolu ou un binding manquant est détecté → ajouter une ligne ici.
- Les modules `[ ]` passent en `[x]` quand un binding complet et testé est disponible.

---
