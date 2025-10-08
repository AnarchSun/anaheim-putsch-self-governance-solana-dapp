// src/lib/TODO.md

# TODO – Libs

## Scope
Ce fichier centralise les helpers & librairies internes.  
Les hooks spécifiques sont suivis dans `src/hooks/TODO.md`.

---

## Libs principales

- [ ] **Solana connection**
    - `src/lib/solana.ts`
    - Centraliser connexion, cluster config & utils
    - Utiliser `.env.local` pour RPC_URL / ProgramID

- [ ] **NFT helpers**
    - `src/lib/nft.ts`
    - Métadonnées (fetch + parse)
    - Uploader vers Arweave (ou storage local en dev)

- [ ] **Governance helpers**
    - `src/lib/governance.ts`
    - Wrappers pour Realms SDK
    - Map wallet → voter / proposal states

- [ ] **Analytics utils**
    - `src/lib/analytics.ts`
    - Parse logs worker
    - Export vers graphiques (ChartRewards, ChartGovernance)

- [ ] **Misc utilities**
    - `src/lib/utils.ts`
    - Formatters (dates, amounts, Solana lamports → USD)
    - Common error handling

---

## Notes (Worker)
- Le worker coche `[ ] → [x]` quand une lib est corrigée ou complétée.
- Si un helper manque lors d’un import non résolu → il est ajouté ici automatiquement.

---
