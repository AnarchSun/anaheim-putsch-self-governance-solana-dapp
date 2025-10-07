// src/utils/resolver/parseErrors.ts

export type ParsedError = {
    kind: "missingImport" | "typeMismatch" | "missingArgs" | "missingSymbol" | "unknown";
    message: string;
    file?: string;
    symbol?: string;
};

export function parseErrors(input: string): ParsedError[] {
    const errors: ParsedError[] = [];

    const lines = input.split("\n");
    for (const line of lines) {
        if (line.includes("has no exported member")) {
            const match = line.match(/has no exported member '(.+)'/);
            errors.push({ kind: "missingImport", message: line, symbol: match?.[1] });
        } else if (line.includes("Cannot find name")) {
            const match = line.match(/Cannot find name '(.+)'/);
            errors.push({ kind: "missingSymbol", message: line, symbol: match?.[1] });
        } else if (line.includes("Expected") && line.includes("arguments")) {
            errors.push({ kind: "missingArgs", message: line });
        } else if (line.includes("is not assignable to type")) {
            errors.push({ kind: "typeMismatch", message: line });
        } else {
            errors.push({ kind: "unknown", message: line });
        }
    }

    return errors;
}
