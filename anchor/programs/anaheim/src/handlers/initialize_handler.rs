// FILE: anchor/programs/anaheim/src/handlers/initialize_handler.rs
use anchor_lang::prelude::*;
use crate::contexts::initialize::Initialize;

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
  let bump = ctx.bumps.anaheim; // ✅ Fix ici

  let account = &mut ctx.accounts.anaheim;
  account.bump = bump;

  Ok(())
}
