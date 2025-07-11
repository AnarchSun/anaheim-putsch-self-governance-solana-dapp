"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/generate-keypair.js
// scripts/generate-keypair.js
var fs_1 = require("fs");
var path_1 = require("path");
var web3_js_1 = require("@solana/web3.js");
var keypair = web3_js_1.Keypair.generate();
var secret = Array.from(keypair.secretKey);
var dir = (0, path_1.join)(process.cwd(), 'wallet');
if (!(0, fs_1.existsSync)(dir))
    (0, fs_1.mkdirSync)(dir);
var filePath = (0, path_1.join)(dir, 'id.json');
(0, fs_1.writeFileSync)(filePath, JSON.stringify(secret));
console.log('✅ Wallet créé et stocké dans wallet/id.json');
console.log('PublicKey:', keypair.publicKey.toBase58());
