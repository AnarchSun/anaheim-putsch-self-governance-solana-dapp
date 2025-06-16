// project/__filename.ts

const path = require('path');

const __dirname = path.dirname(__filename);


console.log('__filename:', __filename)
console.log('__dirname:', __dirname)

// Si tu as besoin de metadata dans Next.js, importe-le séparément,
// ne mélange pas avec les chemins du module courant.
import { metadata } from '../../../backups/src-recov-red/app/layout'

console.log('metadata:', metadata)
