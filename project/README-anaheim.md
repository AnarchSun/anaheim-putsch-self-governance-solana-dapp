Anaheim dApp - README

Anaheim est une plateforme de gouvernance décentralisée inspirée de Reddit et Pi Network, fondée sur la blockchain
Solana et propulsée par Anchor.

"Un putsch progressif contre la ploutocratie, une réinvention du politique par l’éthérique, un mineur devient citoyen."

🔥 Vision

Créer un système d’autogestion basé sur la participation citoyenne, la récompense équitable, et l’authentification
souveraine. Anaheim est un outil de gouvernance, de débat, de vote, et de staking symbolique autour de projets communs
(santé, routes, etc).

🔥 Noté. Voici un énoncé que tu peux insérer dans ton `README-anaheim.md` ou tout manifeste de ton projet :

---

## 🏴‍☠️ AnarCoin Collective Declaration

Ce projet est porté par **l'AnarCoin Collective**, la force vive et insurgée derrière le **Chaotic Fractal AttraKThor
DAO** — moteur du **Putsch Fractal**, du **Soft Coup Gallicism Act**, et de la **Déclaration Véritable d’Indépendance**.

Nous forgeons dans l’ombre un réseau d’autogestion décentralisée, où chaque ligne de code est une incantation
libératrice, chaque transaction une cellule vivante de l’utopie concrète.

> Ici, le protocole est insurrectionnel. Le smart contract, un pacte alchimique. Le dApp, un miroir de l’autonomie
> incarnée.

Nous ne réformons pas, nous transmutons. Nous ne demandons rien — nous forgeons l’alternative.

---

🧱 Stack Technique

Solana & Anchor (v0.31.1)

React (Next.js)

TypeScript

TanStack Query

Gill (pour la typage Solana avancé)

Rust (Programmes on-chain)

📦 Architecture

anaheim-putsch-govdapp/ ├── anchor/ # Scripts Anchor post-build ├── app/ # Pages Next.js ├── components/ # UI et
composants Solana ├── hooks/ # Hooks Solana (wallet, cluster, client) ├── lib/ # Helpers et lib partagées ├── utils/ #
CLI / outils de scaffolding ├── programs/anaheim/ # Programme principal (mining, gouvernance) ├── programs/journal/ #
Programme secondaire (tracking, identité) └── target/ # Générés par Anchor (IDL, types)

⚙️ Fonctionnalités principales

✅ Mining Pi-like (récompenses passives via interaction)

✅ Staking thématique (vote & influence par secteur : santé, routes...)

✅ Réseau social décentralisé (propositions, commentaires, votes)

✅ Authentification NAS/MEDICARE pour identité citoyenne

🛠️ DAO integration : Realms.today, Chaotic Fractal DAO

🔄 Smart Claim pour récupérer les récompenses via contrat intelligent

🧠 Anti-ploutocratie : Visibilité tournante, non biaisée par les baleines

⚒️ Scripts

[scripts] build = "anchor build && node anchor/post-build-copy.js"

📤 Déploiement

Devnet uniquement pour l’instant

Programmes : anaheim, journal

Token principal : r=3.57

🧪 Tests

vitest utilisé pour tests unitaires (React/TypeScript)

Utilise IDL post-build copiés automatiquement dans target/

🔮 À venir

Intégration de citoyens anonymes vérifiés

Smart staking des projets citoyens

Progression publique visible (journaux)

Mode mobile PWA pour mineurs en déplacement

💬 Rejoindre la révolte

Anaheim n’est pas une app, c’est un système. Un organisme politique vivant et évolutif. Construisons une
contre-infrastructure, un territoire autonome, un réseau de vérité.

"La blockchain est la terre, le code est la loi, et nous sommes les architectes de l’insoumission."

🜃 Réveille-toi. Miner c’est gouverner. Anaheim c’est toi.

© 2025 - AnarCoin Collective Anaheim Underground
