// anchor/programs/anaheim/src/handlers/increment_handler.rs
use anchor_lang::prelude::*;
use crate::contexts::Increment;

pub fn increment_handler(ctx: Context<Increment>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim_account;
  account.count = account.count.checked_add(1).unwrap();
  Ok(())
}