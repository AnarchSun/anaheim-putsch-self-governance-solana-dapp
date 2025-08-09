// FILE: anchor/programs/anaheim/src/handlers/initialize_handler.rs
// VERSION FINALE ET CORRECTE

use anchor_lang::prelude::*;
use crate::contexts::Initialize;

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim_account;
  account.count = 0;
  // Ceci va maintenant compiler, car `value` est un champ
  account.value = 0;
  Ok(())
}