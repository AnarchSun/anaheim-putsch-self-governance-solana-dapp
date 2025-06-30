#![allow(deprecated)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod instructions;
pub mod handlers;
pub mod contexts;
pub mod state;
pub mod error;
pub mod constants;
pub mod utils;
pub mod close;
mod validate_post_content;
pub use close::close_post;
use crate::close::CloseAccount;
pub use close::close_post::ClosePost;
pub use handlers::handle_create_user;
pub use contexts::create_user::CreateUser as CreateUserContext;
pub use utils::validation::string_utils::str_to_fixed_array;
pub use instructions::create_user;

declare_id!("B4wa4mhhsxJ3Z7FYd8y1qx9XQCVBTpyLkBTzm1h9PaNC");

pub const MAX_CONTENT_LENGTH: usize = 256;
pub const MAX_USERNAME_LENGTH: usize = 32;

/// ─── ERREURS ────────────────────────────────────────────────────────────────
#[error_code]
pub enum ErrorCode {
  #[msg("Content exceeds max allowable length.")]
  ContentTooLong,
  #[msg("Username exceeds max allowable length.")]
  UsernameTooLong,
  #[msg("Content is invalid (empty or whitespace only).")]
  InvalidContent,
}

/// ─── COMPTES STRUCTURÉS ─────────────────────────────────────────────────────
#[account]
pub struct UserAccount {
  pub name: String,
  pub user_authority: Pubkey,
}
impl UserAccount {
  pub const SIZE: usize = 8 + 4 + MAX_USERNAME_LENGTH + 32;
}

#[account]
pub struct PostAccount {
  pub content: String,
  pub author: Pubkey,
  pub timestamp: i64,
}

#[account]
pub struct AnaheimAccount {
  pub authority: Pubkey,
  pub count: u64,
  pub value: u8,
}
impl AnaheimAccount {
  pub const SIZE: usize = 8 + 32 + 8 + 1;
}

/// ─── CONTEXTES D'INSTRUCTIONS ───────────────────────────────────────────────
#[derive(Accounts)]
pub struct CreateUser<'info> {
  #[account(init, payer = authority, space = UserAccount::SIZE)]
  pub user_account: Account<'info, UserAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(init, payer = user, space = 8 + MAX_CONTENT_LENGTH)]
  pub post_account: Account<'info, PostAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(init, payer = payer, space = AnaheimAccount::SIZE)]
  pub anaheim: Account<'info, AnaheimAccount>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UseAnaheim<'info> {
  #[account(mut)]
  pub anaheim: Account<'info, AnaheimAccount>,
}

#[derive(Accounts)]
pub struct CloseAnaheim<'info> {
  #[account(mut, close = payer)]
  pub anaheim: Account<'info, AnaheimAccount>,
  #[account(mut)]
  pub payer: Signer<'info>,
}

/// ─── PROGRAMME PRINCIPAL ────────────────────────────────────────────────────
#[program]
pub mod anaheim {
  use super::*;

  pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
    let trimmed = username.trim();
    if trimmed.is_empty() {
      return err!(ErrorCode::InvalidContent);
    }
    if trimmed.len() > MAX_USERNAME_LENGTH {
      return err!(ErrorCode::UsernameTooLong);
    }

    let user_account = &mut ctx.accounts.user_account;
    user_account.name = trimmed.to_string();
    user_account.user_authority = *ctx.accounts.authority.key;

    Ok(())
  }

  pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    let trimmed = content.trim();
    if trimmed.is_empty() {
      return err!(ErrorCode::InvalidContent);
    }
    if trimmed.len() > MAX_CONTENT_LENGTH {
      return err!(ErrorCode::ContentTooLong);
    }

    let post_account = &mut ctx.accounts.post_account;
    post_account.content = trimmed.to_string();
    post_account.author = *ctx.accounts.user.key;
    post_account.timestamp = Clock::get()?.unix_timestamp;

    msg!(
      "Post created by {:?} at {}",
      post_account.author,
      post_account.timestamp
    );

    Ok(())
  }

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let account = &mut ctx.accounts.anaheim;
    account.authority = *ctx.accounts.payer.key;
    account.count = 0;
    account.value = 0;
    Ok(())
  }

  pub fn increment(ctx: Context<UseAnaheim>) -> Result<()> {
    ctx.accounts.anaheim.count += 1;
    Ok(())
  }

  pub fn decrement(ctx: Context<UseAnaheim>) -> Result<()> {
    ctx.accounts.anaheim.count -= 1;
    Ok(())
  }

  pub fn set(ctx: Context<UseAnaheim>, value: u64) -> Result<()> {
    ctx.accounts.anaheim.count = value;
    Ok(())
  }

  pub fn close(_ctx: Context<CloseAnaheim>) -> Result<()> {
    Ok(())
  }
}
pub fn close_post_account(_ctx: Context<CloseAccount>) -> Result<()> {
  msg!("Account will be closed!");
  Ok(())
}
