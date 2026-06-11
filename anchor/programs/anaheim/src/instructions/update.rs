// anchor/programs/anaheim/src/instructions/update.rs
use anchor_lang::prelude::*;

use crate::close::close_anaheim::CloseAnaheim;
use crate::contexts::update::UpdatePost;
use crate::contexts::initialize::Initialize;
use crate::handlers::initialize_handler::initialize_handler;

pub fn close(_ctx: Context<CloseAnaheim>) -> Result<()> {
  Ok(())
}

pub fn decrement(ctx: Context<UpdatePost>) -> Result<()> {
  ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_sub(1).unwrap();
  Ok(())
}

pub fn increment(ctx: Context<UpdatePost>) -> Result<()> {
  ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_add(1).unwrap();
  Ok(())
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
  initialize_handler(ctx)
}
pub fn set(ctx: Context<UpdatePost>, value: u8) -> Result<()> {
  ctx.accounts.anaheim.count = value as u64;
  Ok(())
}
