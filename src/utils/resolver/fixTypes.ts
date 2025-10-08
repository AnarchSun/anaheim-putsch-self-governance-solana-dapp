// src/utils/resolver/fixTypes.ts

export async function fixTypes(err: { message: string }) {
    if (err.message.includes("Expected") && err.message.includes("arguments")) {
        return { action: "create_parameter", suggestion: "Add missing parameter to function signature" };
    }
    if (err.message.includes("is not assignable to type")) {
        return { action: "change_type", suggestion: "Adjust TS type annotation" };
    }
    return { action: "ignore", reason: "unknown type issue" };
}
