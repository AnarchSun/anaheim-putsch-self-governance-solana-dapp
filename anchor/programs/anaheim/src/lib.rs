// FILE: anchor/programs/anaheim/src/lib.rs
#![allow(unexpected_cfgs)]
#[allow(deprecated)]
use anchor_lang::prelude::*;

pub mod contexts;
pub mod handlers;
pub mod state;
pub mod error;
pub mod constants;
pub mod utils;
pub mod close;
pub mod validate_post_content;
pub mod instructions;

use contexts::create_user::*;
use contexts::create_post::*;
use contexts::initialize::*;
pub use instructions::use_anaheim::*;

declare_id!("4mvmrkyN16iAHgwwK9BDb3XuFEpE1GTzRbyhkcmDsnrC");
// 4. Le module principal du programme.
#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
    let anaheim_account = &mut ctx.accounts.anaheim_account;
    anaheim_account.value = bump;
    anaheim_account.authority = *ctx.accounts.user.key;
    anaheim_account.count = 0;
    anaheim_account.value = 0;
    Ok(())
  }

  pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    user_account.bump = username.parse().unwrap();
    user_account.authority = *ctx.accounts.authority.key;
    Ok(())
  }

  pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    let post_account = &mut ctx.accounts.post;

    // Convertir le String en bytes
    let bytes = content.as_bytes();
    let mut content_data = [0u8; 280];
    let len = bytes.len().min(280);
    content_data[..len].copy_from_slice(&bytes[..len]);

    post_account.content = content_data;
    post_account.author = *ctx.accounts.user.key;
    post_account.timestamp = Clock::get()?.unix_timestamp;

    Ok(())
  }


  // This instruction will now be included in the IDL
  pub fn increment(ctx: Context<UseAnaheim>) -> Result<()> {
    ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn decrement(ctx: Context<UseAnaheim>) -> Result<()> {
    ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn set(ctx: Context<UseAnaheim>, value: u64) -> Result<()> {
    ctx.accounts.anaheim.count = value;
    Ok(())
  }
}