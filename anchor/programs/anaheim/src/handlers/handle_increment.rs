use anchor_lang::prelude::*;
use crate::contexts::update::UpdatePost;

pub fn handle_increment(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count += 1;
  Ok(())
}

