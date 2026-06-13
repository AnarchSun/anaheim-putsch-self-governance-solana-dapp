use anchor_lang::prelude::*;
use crate::contexts::create_user::CreateUser;
use crate::state::User;
use crate::error::ErrorCode;

pub fn handle_create_user(
  ctx: Context<CreateUser>,
  username: String,
) -> Result<()> {
  let user = &mut ctx.accounts.user_account;

  let bytes = username.as_bytes();
  require!(bytes.len() <= 32, ErrorCode::UsernameTooLong);

  user.username = [0u8; 32];
  user.username[..bytes.len()].copy_from_slice(bytes);

  user.username_len = bytes.len() as u8;
  user.authority = ctx.accounts.authority.key();
  user.timestamp = Clock::get()?.unix_timestamp;
  user.post_count = 0;

  Ok(())
}