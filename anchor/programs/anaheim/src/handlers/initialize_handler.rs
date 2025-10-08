// FILE: anchor/programs/anaheim-old/src/handlers/initialize_handler.rs
use anchor_lang::prelude::*;
<<<<<<< HEAD

use crate::contexts::initialize::Initialize;
pub fn initialize_handler(ctx: &mut Context<Initialize>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim;
  account.authority = ctx.accounts.payer.key();
  account.count = 0;
  account.value = 0;
  account.timestamp = Clock::get()?.unix_timestamp;
  account.vote_count = 0;
=======
use crate::contexts::initialize::Initialize;

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
  let bump = ctx.bumps.anaheim; // ✅ Fix ici

  let account = &mut ctx.accounts.anaheim;
  account.bump = bump;

>>>>>>> main
  Ok(())
}
