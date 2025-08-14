// src/components/transactions/tx_confirmation_check.ts
function txConfirmationCheck(expectedLevel: string, currentLevel: string) {
    const levels = ["processed", "confirmed", "finalized"];

    if (levels.indexOf(expectedLevel) == -1) {
        throw Error(
            "Please use commitment level 'processed', 'confirmed' or 'finalized'"
        );
    }

    if (levels.indexOf(currentLevel) >= levels.indexOf(expectedLevel)) {
        return true;
    }
    return false;
}