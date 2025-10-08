//  src/features/TODO.md

# TODO – Features (Central)

## Scope
Ce fichier regroupe les tâches spécifiques aux features (pages, composants, hooks).  
Il se réfère au plan global défini dans `TODO ROOT – Orion dApp (Full Plan, v2.0)`.

---

## Features principales à implémenter

- [ ] **Onboarding**
    - `/app/onboarding/page.tsx`
    - `/components/onboarding/WelcomeFlow.tsx`
    - `/components/nft/CandyMinter.tsx`

- [ ] **Marketplace**
    - `/app/marketplace/page.tsx`
    - `/components/nft/NFTMarketplace.tsx`
    - `/components/nft/NFTCard.tsx`

- [ ] **Governance (DAO)**
    - `/app/governance/page.tsx`
    - `/components/governance/ProposalList.tsx`
    - `/components/governance/VotePanel.tsx`

- [ ] **Mining & Staking**
    - `/app/stake-mining/page.tsx`
    - `/components/stake/MiningDashboard.tsx`
    - `/components/stake/StakeControls.tsx`
    - Hooks: `/hooks/useStaking.ts`

- [ ] **Analytics**
    - `/app/analytics/page.tsx`
    - `/components/analytics/ChartRewards.tsx`
    - `/components/analytics/ChartGovernance.tsx`

---

## Notes (Worker)
- Le worker mettra à jour ce fichier quand il patch des features.
- Chaque fix dans un composant/page ajoute une ligne dans la section correspondante.
- Les features complètes passent de `[ ]` à `[x]`.

---
