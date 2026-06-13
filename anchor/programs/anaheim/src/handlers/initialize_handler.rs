// FILE: anchor/programs/anaheim/src/handlers/initialize_handler.rs
// VERSION FINALE ET CORRECTE

use anchor_lang::prelude::*;
use crate::contexts::Initialize;

// In your `initialize_handler` function:
pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
  let anaheim_account = &mut ctx.accounts.anaheim_account;

  // ✅ IMPORTANT: When initializing the account, set its authority
  // to the public key of the user who is creating it (the payer/signer).
  anaheim_account.authority = ctx.accounts.user.key();

  // Initialize other fields
  anaheim_account.count = 0;
  anaheim_account.value = 0;

  Ok(())
}