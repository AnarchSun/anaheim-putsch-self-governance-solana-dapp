use anchor_lang::prelude::*;
use crate::contexts::decrement::Decrement;

pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim_account;
  account.count = account.count.checked_sub(1).unwrap();
  Ok(())
}