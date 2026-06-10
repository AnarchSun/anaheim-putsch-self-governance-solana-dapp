use anchor_lang::prelude::*;
use crate::contexts::update::UpdatePost;

pub fn handler(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count = anaheim.count.checked_add(1).unwrap();
  Ok(())
}
