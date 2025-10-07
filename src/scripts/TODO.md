// src/scripts/TODO.md# TODO – Scripts

## Scope
Ce fichier suit les scripts utilitaires du projet (`src/scripts/`).  
Ils servent au build, à la config, aux checks et au déploiement.

---

## Scripts principaux

- [ ] **Anchor build**
    - `src/scripts/anchor-build.sh`
    - Lancer `anchor build`
    - Mettre à jour `.env.local` + `src/config/solana.ts`
    - Automatiser clé `programId`

- [ ] **Anchor deploy**
    - `src/scripts/anchor-deploy.sh`
    - Déployer programmes sur cluster cible
    - Exporter IDs vers config

- [ ] **Candy Machine deploy**
    - `src/scripts/candy-deploy.sh`
    - Upload assets vers Arweave
    - Générer config Candy Machine
    - Initialiser Candy Machine sur Solana

- [ ] **Check tree**
    - `src/scripts/check_tree.sh`
    - Lister imports non résolus
    - Détecter duplicatas de fichiers

- [ ] **Worker runner**
    - `src/scripts/run-worker.sh`
    - Lancer `anaheim-worker` dans Docker
    - Montages nécessaires (`data/`, logs, repo)

- [ ] **Dev helpers**
    - `src/scripts/dev-setup.sh`
    - Installer dépendances (pnpm, anchor, solana-cli)
    - Configurer `.env.local` initial

---

## Notes (Worker)
- Si un script échoue, ajouter ici un point `[ ]` avec le fix à faire.
- Les scripts validés passent en `[x]`.
- Le worker peut patcher automatiquement `check_tree.sh` ou `dev-setup.sh`.

---
