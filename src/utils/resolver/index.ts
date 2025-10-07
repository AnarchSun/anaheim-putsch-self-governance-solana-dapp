#!/usr/bin/env node
// src/utils/resolver/index.ts

import { parseErrors } from "./parseErrors";
import { fixImports } from "./fixImports";
import { fixTypes } from "./fixTypes";
import { createSquelettes } from "./createSquelettes";

async function main() {
    const args = process.argv.slice(2);
    if (!args.length) {
        console.error("Usage: resolver <file-or-error-log>");
        process.exit(1);
    }

    const input = args[0];
    const errors = parseErrors(input);

    const results: any[] = [];
    for (const err of errors) {
        if (err.kind === "missingImport") {
            results.push(await fixImports(err));
        } else if (err.kind === "typeMismatch" || err.kind === "missingArgs") {
            results.push(await fixTypes(err));
        } else if (err.kind === "missingSymbol") {
            results.push(await createSquelettes(err));
        } else {
            results.push({ action: "ignore", reason: "unknown error", err });
        }
    }

    console.log(JSON.stringify(results, null, 2));
}

main().catch(e => {
    console.error("Resolver failed:", e);
    process.exit(1);
});
