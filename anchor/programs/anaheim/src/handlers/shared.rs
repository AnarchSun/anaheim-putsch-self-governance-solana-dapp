// ===================== handlers/shared.rs =====================
use anchor_lang::prelude::*;

use crate::contexts::update::UpdatePost;
use crate::contexts::create_post::CreatePost;
use crate::error::ErrorCode;
use crate::instructions::initialize::Initialize;
use crate::instructions::use_anaheim::UseAnaheim;
use crate::state::post_account::PostAccount;
pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
  let account = &mut ctx.accounts.anaheim;
  account.count = 0;
  account.value = 0;
  Ok(())
}

pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
  if content.len() > 280 {
    return Err(ErrorCode::InvalidContent.into());
  }
  let post_account = &mut ctx.accounts.post_account;
  post_account.content = string_to_fixed(&content);
  post_account.author = *ctx.accounts.user.key;
  post_account.timestamp = Clock::get()?.unix_timestamp;
  msg!("Post created: {}", content);
  Ok(())
}

fn string_to_fixed(s: &String) -> String {
  let bytes = s.as_bytes();
  let _ = bytes.len().min(280);

  // We can slice safely on UTF-8 boundaries by slicing on chars, but for simplicity:
  // Let's just truncate to len bytes (risk cutting UTF-8 char), or safer, truncate by chars.

  // Safer way: truncate by char count (assuming max 280 chars, not bytes)
  s.chars().take(280).collect()
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

pub fn handle_increment(ctx: Context<UseAnaheim>) -> Result<()> {
  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.value = anaheim.value.checked_add(1).unwrap_or(anaheim.value);
  Ok(())
}

pub fn fill_post_fields(post_account: &mut Account<PostAccount>, content: String) -> Result<()> {
  let content_str = std::str::from_utf8((&post_account.content).as_ref())
      .unwrap_or("")
      .trim_end_matches(char::from(0));
  msg!("Post content: {}", content_str);
  post_account.content = string_to_fixed(&content);
  post_account.timestamp = Clock::get()?.unix_timestamp;
  Ok(())
}

// Utilitaire pour convertir le contenu stocké (fix-size array) en &str
pub fn content_to_string(content: &[u8; 280]) -> &str {
  std::str::from_utf8(content)
      .unwrap_or("")
      .trim_end_matches(char::from(0))
}
