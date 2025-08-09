// FILE: anchor/programs/anaheim/src/handlers/handle_create_user.rs
// VERSION FINALE ET DÉFINITIVE

use anchor_lang::prelude::*;
use crate::contexts::CreateUser;
use crate::error::ErrorCode; // ✅ Utilisation de ErrorCode
use crate::constants::MAX_USERNAME_LENGTH;

pub fn handle_create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
  // ✅ FIX : On utilise `ctx.accounts`, pas `ctx::accounts`.
  let user_account = &mut ctx.accounts.user_account;

  let name_bytes = username.as_bytes();

  require!(!username.trim().is_empty(), ErrorCode::InvalidContent);
  require!(name_bytes.len() <= MAX_USERNAME_LENGTH, ErrorCode::UsernameTooLong);

  user_account.authority = ctx.accounts.authority.key();
  user_account.timestamp = Clock::get()?.unix_timestamp;

  // ✅ FIX : On utilise l'accès direct par point pour la bump.
  user_account.bump = ctx.bumps.user_account;

  user_account.username_len = name_bytes.len() as u8;
  user_account.username[..name_bytes.len()].copy_from_slice(name_bytes);

  Ok(())
}