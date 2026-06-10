<<<<<<< HEAD
// FILE: anchor/programs/anaheim/src/handlers/initialize_handler.rs
use anchor_lang::prelude::*;
use super::super::instructions::initialize::Initialize;

pub fn handle_initialize(ctx: Context<Initialize>) -> Result<()> {
    let account = &mut ctx.accounts.anaheim;
    account.authority = *ctx.accounts.payer.key;
    account.count = 0;
    account.value = 0;
    Ok(())
}
=======
// FILE: anchor/programs/anaheim-old/src/handlers/initialize_handler.rs
use anchor_lang::prelude::*;
use crate::contexts::initialize::Initialize;

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
  let bump = ctx.bumps.anaheim; // ✅ Fix ici

  let account = &mut ctx.accounts.anaheim;
  account.bump = bump;

  Ok(())
}
>>>>>>> main
