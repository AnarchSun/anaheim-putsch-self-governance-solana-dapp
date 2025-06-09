use anchor_lang::prelude::*;

use crate::contexts::initialize::Initialize;
pub fn initialize_handler(ctx: &mut Context<Initialize>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim;
  account.authority = ctx.accounts.payer.key();
  account.count = 0;
  account.value = 0;
  account.timestamp = Clock::get()?.unix_timestamp;
  account.vote_count = 0;
  Ok(())
}
