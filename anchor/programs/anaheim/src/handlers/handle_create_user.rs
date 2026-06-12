use anchor_lang::prelude::*;
use crate::contexts::create_user::CreateUser;
use crate::error::ErrorCode;

pub fn handle_create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
  let user_account = &mut ctx.accounts.user_account;

  let name_bytes = username.as_bytes();
  require!(name_bytes.len() <= 32, ErrorCode::UsernameTooLong);

  user_account.authority = ctx.accounts.authority.key();
  user_account.timestamp = Clock::get()?.unix_timestamp;

  user_account.username_len = name_bytes.len() as u8;
  user_account.username[..name_bytes.len()].copy_from_slice(name_bytes);

  user_account.post_count = 0;

  Ok(())
}