// scripts/init-template.ts
console.log("Initializing template... Hail Chaos!!⚙️");
import fs from 'fs/promises';
import path from 'path';

const MODULES = ['stake', 'governance', 'post'];

async function run() {
  for (const name of MODULES) {
    const dir = path.resolve(__dirname, `../src/modules/${name}`);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${name}.ts`), `// ${name} module\n`);
    console.log(`⚙️  Created module: ${name}`);
  }
  console.log('🎉 Template initialized. Hail Chaos!!');
}

run();
console.log("All Done! Initializing template... Hail Chaos!!⚙️");