use anchor_lang::prelude::*;
use crate::contexts::update::UpdatePost;

pub fn handler(ctx: Context<UpdatePost>, value: u8) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count = value as u64;
  Ok(())
}
