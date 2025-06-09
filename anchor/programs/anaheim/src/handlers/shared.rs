// ===================== handlers/shared.rs =====================
use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::contexts::update::UpdatePost;
use crate::contexts::create_user::CreateUser;
use crate::contexts::initialize::Initialize;
use crate::contexts::create_post::CreatePost;

fn string_to_fixed<const N: usize>(s: &str) -> [u8; N] {
  let bytes = s.as_bytes();
  let mut array = [0u8; N];
  let len = bytes.len().min(N);
  array[..len].copy_from_slice(&bytes[..len]);
  array
}

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim;
  account.count = 0;
  account.value = 0;
  Ok(())
}

pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
  if username.len() > 32 {
    return Err(ErrorCode::InvalidContent.into());
  }
  let user_account = &mut ctx.accounts.user_account;
  user_account.username = string_to_fixed::<32>(&username);
  user_account.authority = *ctx.accounts.user.key;
  user_account.timestamp = Clock::get()?.unix_timestamp;
  msg!("User created: {}", username);
  Ok(())
}

pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
  if content.len() > 280 {
    return Err(ErrorCode::InvalidContent.into());
  }
  let post_account = &mut ctx.accounts.post_account;
  post_account.content = string_to_fixed::<280>(&content);
  post_account.author = *ctx.accounts.user.key;
  post_account.created_at = Clock::get()?.unix_timestamp;
  msg!("Post created: {}", content);
  Ok(())
}

pub fn set_value(ctx: Context<UpdatePost>, value: u8) -> Result<()> {
  let anaheim_account = &mut ctx.accounts.anaheim;
  anaheim_account.value = value;
  Ok(())
}

pub fn increment(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count = anaheim.count.checked_add(1).ok_or(ErrorCode::Overflow)?;
  Ok(())
}

pub fn decrement(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.count = anaheim.count.checked_sub(1).ok_or(ErrorCode::Underflow)?;
  Ok(())
}

pub fn handle_increment(ctx: Context<UpdatePost>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.value = anaheim.value.checked_add(1).unwrap_or(anaheim.value);
  Ok(())
}
