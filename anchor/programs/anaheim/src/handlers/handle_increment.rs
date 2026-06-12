// anchor/programs/anaheim/src/handlers/handle_increment.rs
use anchor_lang::prelude::*;
use crate::contexts::increment::Increment;
use crate::state::AnaheimAccount;

pub fn handle_increment(ctx: Context<Increment>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim_account;
  account.count += 1;
  Ok(())
}