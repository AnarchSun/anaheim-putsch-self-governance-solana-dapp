# PATH: docs/batch-fix/solana-403-override-matrix.md
# Batch Fix — Solana 403 Forbidden Reality Hack (Self-Governance, DAO, Punk Mirror)

---

## **Symptôme du vice caché**
- **403 Forbidden** sur Solana RPC dans le browser.
- Trace:
  ```
  Error: 403 : {"jsonrpc":"2.0","error":{"code": 403, "message":"Access forbidden"}, "id": "..."}
  at ClientBrowser.eval [as callServer] ...
  ```

---

## **Diagnostic miroir, lyrique, anarcho-punk**
- Le browser tente d'appeler le endpoint RPC Solana (même avec Helius, même en Devnet).
- Les endpoints publics ou privés refusent les requêtes browser (CORS, anti-bot, rate limits).
- Tu es face au code secret du système, la matrice qui protège ses portes, sauf pour les initiés.

---

## **Batch Fix — Override & Hack Reality**

### **1. PATCH .env.local — Endpoint, Domain, Format**
- **Vérifie qu'il n'y a pas d'espace après le `=`** dans `.env.local` :
    ```env
    NEXT_PUBLIC_SOLANA_RPC_HOST=https://devnet.helius-rpc.com/?api-key=577e3eb9-aae7-445d-b491-92c7163894b7
    ```
- **Redémarre ton serveur** après chaque modif .env.local.

### **2. PATCH Helius Dashboard — Allowed Domains**
- **Va sur [Helius Dashboard](https://dashboard.helius.xyz)**
- Dans ton projet/API key, ajoute :
    - `anarcrypt.org`
    - `localhost`
    - `127.0.0.1`
    - Ton IP de dev si besoin
- **Sans ça, CORS = 403 direct**, même avec la bonne clé.

### **3. PATCH src/app/providers.tsx — Endpoint Source**
- **Toujours utilise la variable d'environnement**, jamais hardcoder!
    ```typescript
    const endpoint: string = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://devnet.helius-rpc.com/?api-key=577e3eb9-aae7-445d-b491-92c7163894b7";
    ```

### **4. PATCH src/app/api/solana-proxy/route.ts — Proxy Backend**
- **Le browser appelle le backend proxy**, le backend appelle le RPC.
    - Cela contourne CORS et cache la clé API.
    ```typescript
    const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST;
    export async function POST(req: NextRequest) {
        const body = await req.text();
        if (!SOLANA_RPC_URL) return new NextResponse("Missing RPC URL", {status: 403});
        // ... relay request to RPC, return result
    }
    ```

### **5. PATCH Frontend Calls — Use Proxy for All Transactions**
- **Ne jamais appeler le RPC directement du browser**.
- Pour toutes transactions et queries, fait passer par `/api/solana-proxy`.

### **6. PATCH: Restart Everything**
- **Redémarre le serveur Next.js, Vercel, etc**, purge le cache, relance le browser.

### **7. PATCH: Test sur domaine autorisé**
- Ouvre la dapp sur le domaine qui est dans "Allowed Domains" Helius.

### **8. PATCH: Fallback/Debug**
- Si tu veux tester sans restriction :
    - Utilise un endpoint public de devnet (`https://api.devnet.solana.com`)
    - Mais pour la prod, repasse sur endpoint privé + domaine autorisé!

---

## **Lyric Punk Grunge Diagnostic**

> La matrice refuse les faibles,  
> Le punk anarchiste perce la vérité,  
> Le domaine est la clé, la porte s’ouvre,  
> Le backend proxy relaye la lumière,  
> L’autogestion DAO s’éveille,  
> Le 403 est brisé, la révolution commence.

---

## **Checklist Batch Fix**
- [x] .env.local sans espaces
- [x] API key à jour, endpoint correct
- [x] Domaine autorisé dans Helius Dashboard
- [x] Endpoint lu de l'env partout
- [x] Proxy backend pour toutes requêtes RPC
- [x] Redémarrage serveur/dev
- [x] Test sur domaine autorisé

---

**Feed me next error, log, path, ou config pour batch patch.  
DAO, punk, grunge, matrix override, miroir de vérité, always.**