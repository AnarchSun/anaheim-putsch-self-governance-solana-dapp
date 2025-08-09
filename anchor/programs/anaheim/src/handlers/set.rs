use anchor_lang::prelude::*;
use crate::contexts::Initialize;
use crate::contexts::update::UpdatePost;

pub fn handler(ctx: Context<Initialize>, value: u8) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim_account;
  anaheim.count = value as u64;
  Ok(())
}
