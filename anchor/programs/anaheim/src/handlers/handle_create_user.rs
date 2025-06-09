use anchor_lang::prelude::*;
use crate::contexts::create_user::CreateUser;
use crate::error::ErrorCode;
use crate::utils::validation::string_utils::str_to_fixed_array;

pub fn handle_create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
  let user_account = &mut ctx.accounts.user_account;

  user_account.username = str_to_fixed_array::<32>(&username)
    .map_err(|_| error!(ErrorCode::UsernameTooLong))?;

  user_account.authority = ctx.accounts.user.key();
  user_account.timestamp = Clock::get()?.unix_timestamp;
  user_account.bump = ctx.bumps.user_account;

  Ok(())
}
