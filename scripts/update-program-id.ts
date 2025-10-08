import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import TOML from '@iarna/toml';
import { fileURLToPath } from 'url';

// --- ES Module __dirname shim ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Charger .env.local à la racine du projet ---
const envPath = path.join(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

// --- Déterminer Program ID depuis .env.local ou Anchor.toml ---
let programId: string = process.env.NEXT_PUBLIC_PROGRAM_ID || '';

if (!programId) {
    console.log('⚠️ NEXT_PUBLIC_PROGRAM_ID absent dans .env.local, lecture depuis Anchor.toml...');
    const anchorTomlPath = path.join(__dirname, '..', 'anchor', 'Anchor.toml');

    if (!fs.existsSync(anchorTomlPath)) {
        throw new Error(`Anchor.toml introuvable à l'emplacement attendu : ${anchorTomlPath}`);
    }

    const anchorTomlContent = fs.readFileSync(anchorTomlPath, 'utf8');
    const parsed = TOML.parse(anchorTomlContent);

    programId =
        parsed.programs?.devnet?.anaheim ||
        parsed.programs?.localnet?.anaheim ||
        '';

    if (!programId) {
        throw new Error('Program ID introuvable dans Anchor.toml et .env.local');
    }

    console.log(`✅ Program ID trouvé dans Anchor.toml → ${programId}`);
}

// --- Mettre à jour src/config/solana.ts ---
const configPath = path.join(__dirname, '..', 'src', 'config', 'solana.ts');
const configSrc = fs.readFileSync(configPath, 'utf8');
const configPatched = configSrc.replace(
    /programId:\s*['"].+['"]/,
    `programId: '${programId}'`
);
fs.writeFileSync(configPath, configPatched);
console.log(`✅ src/config/solana.ts mis à jour → ${programId}`);

// --- Mettre à jour .env.local ---
let envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
if (!envText.includes('NEXT_PUBLIC_PROGRAM_ID')) {
    envText += `\nNEXT_PUBLIC_PROGRAM_ID=${programId}\n`;
} else {
    envText = envText.replace(
        /NEXT_PUBLIC_PROGRAM_ID=.*/,
        `NEXT_PUBLIC_PROGRAM_ID=${programId}`
    );
}
fs.writeFileSync(envPath, envText);
console.log(`✅ .env.local mis à jour → ${programId}`);
