// File: handlers/handler_mine.rs
// --------------------------
use anchor_lang::prelude::*;
use crate::contexts::mine::Mine;

pub fn handle_mine(ctx: Context<Mine>) -> Result<()> {
  let post = &mut ctx.accounts.post;
  post.vote_count += 1;
  Ok(())
}
