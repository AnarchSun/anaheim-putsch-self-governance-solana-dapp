import fs from 'fs';
import path from 'path';

// Chemin vers le IDL Anchor généré
const idlPath = path.join(__dirname, '../target/idl/YOUR_PROGRAM.json'); // Remplace YOUR_PROGRAM
const solanaConfigPath = path.join(__dirname, '../config/solana.ts');

const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
const newProgramId = idl.metadata.address;

// Lis le fichier solana.ts
let solanaConfig = fs.readFileSync(solanaConfigPath, 'utf8');

// Regex pour remplacer le programId existant
solanaConfig = solanaConfig.replace(
    /programId:\s*"(.*?)"/,
    `programId: "${newProgramId}"`
);

// Écris le résultat batch fix dans solana.ts
fs.writeFileSync(solanaConfigPath, solanaConfig);

console.log(`Batch fix: programId updated to ${newProgramId} in config/solana.ts`);