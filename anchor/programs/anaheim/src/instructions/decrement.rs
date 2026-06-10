use anchor_lang::prelude::*;
use crate::contexts::update::UpdatePost;

pub fn decrement(ctx: Context<UpdatePost>) -> Result<()> {
  handle_decrement(ctx)
}

fn handle_decrement(_ctx: Context<UpdatePost>) -> Result<()> {
  // implémentation à venir
  Ok(())
}
