// scripts/TODO.md

# TODO – Global Scripts

## Scope
Scripts globaux pour l’infrastructure et l’automatisation (hors `src/scripts/`).  
Ils couvrent le setup de l’environnement, CI/CD, migrations, monitoring.

---

## Scripts globaux

- [ ] **Project setup**
    - `scripts/setup.sh`
    - Installer dépendances système (rust, node, pnpm, docker)
    - Préparer `.env` global

- [ ] **Database migrations**
    - `scripts/migrate.sh`
    - Exécuter migrations Postgres (si DB utilisée)
    - Vérifier état des schémas

- [ ] **CI/CD pipeline**
    - `scripts/ci.sh`
    - Lancer tests unitaires + lint + build
    - Générer artefacts de build

- [ ] **Deploy staging**
    - `scripts/deploy-staging.sh`
    - Déploiement auto sur cluster de test
    - Pousser images Docker vers registry

- [ ] **Deploy production**
    - `scripts/deploy-prod.sh`
    - Déploiement auto en prod
    - Vérifications post-déploiement

- [ ] **Monitoring / Logs**
    - `scripts/logs.sh`
    - Suivi des logs Docker / worker
    - Grep rapide des erreurs critiques

---

## Notes (Worker)
- Les erreurs détectées dans la CI ou le déploiement sont ajoutées ici.
- `[ ]` devient `[x]` quand validé/testé.
- Le worker peut auto-patcher `setup.sh` ou `logs.sh` en priorité.

---
