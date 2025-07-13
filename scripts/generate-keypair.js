// scripts/generate-keypair.js
import fs from 'fs';
import path from 'path';
import { Keypair } from '@solana/web3.js';

const keypair = Keypair.generate();
const secret = Array.from(keypair.secretKey);

const walletDir = path.join(process.cwd(), 'wallet');
if (!fs.existsSync(walletDir)) fs.mkdirSync(walletDir);

const filePath = path.join(walletDir, 'id.json');
fs.writeFileSync(filePath, JSON.stringify(secret));

console.log('✅ Wallet id.json généré dans /wallet/id.json');
console.log('PublicKey:', keypair.publicKey.toBase58());
