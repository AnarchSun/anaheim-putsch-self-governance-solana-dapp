/src /components /solana # Interface utilisateur et hooks spécifiques Solana

- SolanaProvider.tsx
- WalletConnect.tsx
- MiningPanel.tsx /ui # Composants purement visuels et réutilisables /hooks /solana # Hooks fonctionnels liés à Solana
  blockchain
- useSolanaClient.ts
- useWalletAddress.ts
- useStakeStatus.ts /utils # Hooks utilitaires, helpers /lib /solana # Fonctions utilitaires Solana (RPC, conversions)
  /helpers # Fonctions générales, outils /types # Déclarations de types, interfaces /programs # Anchor programs,
  contrats intelligents /pages # Routes Next.js (si applicable) /store # Gestion d’état, contextes
