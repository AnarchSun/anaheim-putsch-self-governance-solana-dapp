// anchor/programs/anaheim/src/instructions/update.rs
use anchor_lang::prelude::*;

use crate::contexts::update::UpdatePost;
use crate::close::close_anaheim::CloseAnaheim;
use crate::handlers::shared::initialize_handler;
use crate::instructions::initialize::Initialize as InitializeInstruction;

pub fn initialize(ctx: Context<InitializeInstruction>) -> Result<()> {
  initialize_handler(ctx)
}

pub fn close(_ctx: Context<CloseAnaheim>) -> Result<()> {
  Ok(())
}

pub fn increment(ctx: Context<UpdatePost>) -> Result<()> {
  ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_add(1).unwrap();
  Ok(())
}

<<<<<<< HEAD
=======
pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
  initialize_handler(ctx)
}

>>>>>>> main
pub fn set(ctx: Context<UpdatePost>, value: u8) -> Result<()> {
  ctx.accounts.anaheim.count = value as u64;
  Ok(())
}
