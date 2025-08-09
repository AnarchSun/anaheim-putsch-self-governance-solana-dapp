// FILE: anchor/programs/anaheim/src/handlers/decrement_handler.rs
// VERSION FINALE ET CORRECTE

use anchor_lang::prelude::*;
use crate::contexts::Decrement; // ✅ On utilise le nouveau contexte 'Decrement'
use crate::error::ErrorCode;   // Assurez-vous d'avoir un enum d'erreur

pub fn decrement_handler(ctx: Context<Decrement>) -> Result<()> {
  // ✅ On accède au bon compte, 'anaheim_account'.
  let anaheim_account = &mut ctx.accounts.anaheim_account;

  // ✅ 'count' est un champ, pas une méthode. Pas de parenthèses.
  // On décrémente 'count', pas 'value'.
  anaheim_account.count = anaheim_account.count.checked_sub(1).ok_or(ErrorCode::Underflow)?;

  Ok(())
}