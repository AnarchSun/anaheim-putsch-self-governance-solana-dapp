// scripts/fetch-templates.ts
console.log("Fetching templates... 🧙‍♂️");
import fs from 'fs/promises';
import path from 'path';

const TEMPLATE_DIR = path.resolve(__dirname, '../templates');

async function run() {
  console.log('🧙‍♂️ Fetching templates from', TEMPLATE_DIR);
  const files = await fs.readdir(TEMPLATE_DIR);
  for (const file of files) {
    console.log('→ Template:', file);
  }
}

run();
console.log("All done! Fetching templates... 🧙‍♂️");