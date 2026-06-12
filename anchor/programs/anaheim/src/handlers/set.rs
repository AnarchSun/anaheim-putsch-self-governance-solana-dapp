use anchor_lang::prelude::*;
use crate::contexts::initialize;

pub fn handler(ctx: Context<initialize>, value: u8) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim_account;
  anaheim.count = value as u64;
  Ok(())
}
