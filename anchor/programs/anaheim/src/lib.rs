// anchor/programs/anaheim/src/lib.rs
#![allow(deprecated)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey::Pubkey;

pub mod error;
pub mod constants;
mod validate_post_content;

use crate::program::Anaheim;

declare_id!("DV7eTRbWHnDjgh6uHGo6k8ExXBvgWEVPNNqSmdGrXAnJ");

pub const ANAHEIM_IDL_ID: Pubkey = Pubkey::new_from_array([
  132, 157, 218, 39, 146, 184, 154, 229, 157, 208, 222, 217, 179, 105, 214, 114,
  145, 251, 14, 120, 48, 169, 34, 96, 132, 73, 172, 248, 93, 142, 25, 203,
]);

// 👇 Déclare le trait manquant
pub trait IdlInstruction {
  fn id() -> Pubkey;
}
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

// Ajoutez ceci dans le même fichier ou dans un module instruction

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(init, payer = payer, space = AnaheimAccount::SIZE)]
  pub anaheim: Account<'info, AnaheimAccount>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
  #[account(mut, close = user)]
  pub post_account: Account<'info, PostAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

impl IdlInstruction for Anaheim {
  fn id() -> Pubkey {
    ANAHEIM_IDL_ID
  }
}


/// ─── PROGRAMME PRINCIPAL ────────────────────────────────────────────────────
#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: &Context<instruction::Initialize>, bump: u8) -> Result<()> {
    let anaheim_account = &mut ctx.accounts.anaheim;
    anaheim_account.bump = bump;
    anaheim_account.authority = *ctx.accounts.payer.key;
    anaheim_account.count = 0;
    anaheim_account.value = 0;
    Ok(())
  }
}
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

pub fn close_post_account(_ctx: Context<CloseAccount>) -> Result<()> {
  msg!("Account will be closed!");
  Ok(())
}
