codename: anaheim status: alpha platform: Solana description: > Anaheim is a decentralized governance dApp built on
Solana, designed to dismantle state structures through token-based direct democracy, passive reward mechanisms,
citizen-authenticated participation, and thematic staking options. The project emphasizes decentralization,
self-governance, and chaos-fractal-based equitable emergence.

components: mining: path: src/components/mining/mining-panel.tsx description: > Daily passive reward panel simulating a
Pi Network model. Uses localStorage to track last claim, 24h cooldown, and progress bar UI. Intended to be connected to
r=3.57 token and smart contract claim mechanism. governance: ui: reddit-style features:

- subreddits-like categories for proposals
- rotating visibility to prevent token-based monopolies
- support for citizen proposals regardless of token holdings tokenomics: main_token: r=3.57 description: > The native
  token used for gas and passive rewards. Inspired by Thorchain. passive_reward_model: true multi_token_support: true
  thematic_tokens:
- health
- water
- roads
- education staking: model: progressive laundering description: > Citizens stake funds for themed ministries (health,
  roads, etc). Dirty funds laundered by locking them long-term. The longer the lock, the higher the recovery rate (e.g.,
  2 years = 50%, 10 years = 85%). identity: method: NAS / Medicare number privileges:
- voting
- proposal submission games: purpose: Learn2Earn examples:
- Legal system education
- DAO mechanics
- Constitution writing reward_model: educational micro-incentives

integration: DAOs:

- realms.today
- Chaotic Fractal AttraKThor DAO smart_contracts: mining_claim: TBD reward_mint: TBD

next_tasks:

Wire mining-panel.tsx to smart contract (claim r=3.57)

Create claim instruction in Anchor program

Mint or transfer r=3.57 on claim

Enforce 24h cooldown via PDA or validator

Add NAS/Medicare-based auth hook to React app

Add sub-governance modules (subreddits)

Auto-rotation logic for top-voted proposals

recovery: snapshot_file: anaheim.snapshot.json instructions: > If reset occurs, re-upload anaheim.snapshot.json or paste
its content to instantly recover full project vision, architecture, file structure, and next objectives.

metadata: created_by: anarchSun maintained_by: anarchSun + gpt-memory-vault dependencies: framework: Next.js + Tailwind
CSS + TypeScript solana: "@solana/web3.js", "@coral-xyz/anchor" wallet: "@solana/wallet-adapter-\*" dao: "realms.today"
styling: "lucide-react", "sonner", "tailwind-merge" logic: "zod", "tanstack/react-query" testing: vitest + jest + tsx
cli: pnpm + unbuild + create-solana-dapp
