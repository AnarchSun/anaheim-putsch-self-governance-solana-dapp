# TODO ROOT – Orion dApp (Full Plan, v2.0)

## 0. Branches & workflow (conventions)
- Branches principales :
  - `main` → production (push manuel)
  - `roots` → branche collaborative (on y push < 6 erreurs)
  - `orion` → worker autonome (autopilot / exploration / surprises)
  - `dump` → fichiers mis en quarantaine / scrap
- Règle de commit :
  - ≤ 6 erreurs lint/typescript → push sur `roots`
  - > 6 erreurs → leave on `orion`, notification "requires human"
  - Commits fréquents, petits (20 min max ou scope limité)
- Chaque commit contient un résumé bref (fichier `progress/last_summary.md`)

## 1. ENV & Infrastructure
- [ ] `.env.local` keys:
  - NEXT_PUBLIC_SOLANA_RPC_URL
  - NEXT_PUBLIC_PROGRAM_ID
  - NEXT_PUBLIC_CANDY_MACHINE_ID
  - NEXT_PUBLIC_REALMS_DAO_ID
  - (OPTIONAL) NEXT_PUBLIC_LOCALNET_PORT
- [ ] `src/config/solana.ts` centralise lecture `.env.local`
- [ ] `anchor/Anchor.toml` → localnet by default
- [ ] `scripts/anchor-build.sh` → lance `anchor build`, parse sortie, met à jour `.env.local` + `src/config/solana.ts`
- [ ] Worker doit pouvoir démarrer test-validator local si absent (`solana-test-validator`)
- HUMAN: config solana cli (`solana config set --url localhost`) et clé admin (keypair `id.json`)

## 2. Onboarding (Fast Mint + Profile NFT)
- Pages & components:
  - `/app/onboarding/page.tsx`
  - `/components/onboarding/WelcomeFlow.tsx`
  - `/components/nft/CandyMinter.tsx`
- Flow:
  - Create account → Explain feed/gas/mining → Mint via Candy Machine (random) → Set PFP
- Bonus mining:
  - +10% mining reward if profile NFT actif (lock 6–24mois)
- HUMAN: upload collection images + metadata to Arweave / choose CandyMachine config

## 3. Marketplace
- `/app/marketplace/page.tsx`
- `/components/nft/NFTMarketplace.tsx`, `/components/nft/NFTCard.tsx`
- `/config/nftCollections.ts` (array of {name, arweaveCID, contractId})
- Owned NFTs UI, buy flow (not Candy Machine)

## 4. Governance (DAO)
- `/app/governance/page.tsx`
- `/components/governance/ProposalList.tsx`, `VotePanel.tsx`
- On Mint → add fixed amount (ex: 3$ token equivalent) to Governance Treasury
- Integrate Realms SDK; map wallet → voter
- HUMAN: set REALMS DAO ID, and manual review for on-chain governance execution

## 5. Mining & Staking
- `/app/stake-mining/page.tsx`
- `/components/stake/MiningDashboard.tsx`, `StakeControls.tsx`
- Anchor programs in `anchor/programs/anaheim/`:
  - `staking.rs` (stake accounts, lock periods)
  - `rewards.rs` (distribution)
- Hooks: `/hooks/useStaking.ts`
- Auto-stake behavior:
  - When reward >= $5 equivalent → convert vs mint → auto-add to LP (configurable)
  - Provide options 6/12/18 months; longer → bonus %

## 6. Analytics & Monitoring
- `/app/analytics/page.tsx`
- `/components/analytics/ChartRewards.tsx`, `ChartGovernance.tsx`
- Worker logs fixes → `data/fixes.json` & `data/patches/`
- UI shows last worker actions (last_summary.md)

## 7. Shared libs & helpers
- `/lib/solana.ts` central connection
- `/lib/nft.ts` metadata helpers + arweave uploader
- Hooks:
  - `useWallet`, `useCandyMachine`, `useGovernance`, `useProgram`, `useAnalytics`

## 8. Worker / Autopilot (anaheim-worker)
- Worker responsibilities:
  - Lire build/dev/next logs
  - Extraire erreurs récurrentes (deprecated, does not exist on type, unused imports)
  - Pour les erreurs fixes automatiques : créer patch dans `/data/patches/`
  - Tenir `data/fixes.json` (historique fixes)
  - Quand > X tentatives sur la même erreur → open issue / mark “needs human”
  - Dedupe files / search duplicates; generate report
- Dockerize worker (we have `anaheim-worker/docker/Dockerfile.worker`)

## 9. Sync & anti-duplication
- Avant ajout d’un component: `scripts/check_tree.sh` (liste unresolved imports)
- Toujours importer RPC & ProgramID via `src/config/solana.ts` (single source)
- Worker : on first run, run duplicate pass and create `root_cleanup_report.md`

## 10. Candy Machine + NFT pipeline
- Option: clone Metaplex Candy Machine v3 into `tools/candy-machine/`
- `scripts/candy-deploy.sh` → prepare assets, upload to arweave (or local arweave mock), create candy config
- HUMAN: fund account for arweave / pinata / storage
- Start with AirWeave/Arweave recommended for permanence. Local HDD store is possible for dev only.

## 11. Docker & Build rules
- UI changes → `pnpm dev` (no image build)
- Anchor/program changes → `scripts/anchor-build.sh` then rebuild worker as needed
- Worker runs in Docker; mount project and `data/` for persistence
