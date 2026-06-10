#![allow(deprecated)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::system_program::System;

use crate::error::ErrorCode;
pub mod error;
pub mod constants;
pub mod validate_post_content;
pub mod utils;

declare_id!("qrXvBtncGo13otJbxoDdoZUhybeoExevsLC4dCgTQmP");

pub const MAX_CONTENT_LENGTH: usize = 256;
pub const MAX_USERNAME_LENGTH: usize = 32;

#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let anaheim = &mut ctx.accounts.anaheim;

    anaheim.authority = *ctx.accounts.payer.key;
    anaheim.count = 0;
    anaheim.value = 0;

    Ok(())
  }

  pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
    let trimmed = username.trim();

    require!(!trimmed.is_empty(), ErrorCode::InvalidContent);
    require!(trimmed.len() <= MAX_USERNAME_LENGTH, ErrorCode::UsernameTooLong);

    let user = &mut ctx.accounts.user_account;
    user.name = trimmed.to_string();
    user.user_authority = *ctx.accounts.authority.key;

    Ok(())
  }

  pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    let trimmed = content.trim();

    require!(!trimmed.is_empty(), ErrorCode::InvalidContent);
    require!(trimmed.len() <= MAX_CONTENT_LENGTH, ErrorCode::ContentTooLong);

    let post = &mut ctx.accounts.post_account;
    post.content = trimmed.to_string();
    post.author = ctx.accounts.user.key();
    post.timestamp = Clock::get()?.unix_timestamp;

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
    msg!("Account closed");
    Ok(())
  }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(init, payer = payer, space = 8 + 32 + 8 + 8)]
  pub anaheim: Account<'info, Anaheim>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(
    init,
    payer = authority,
    space = 8 + 4 + MAX_USERNAME_LENGTH + 32
  )]
  pub user_account: Account<'info, User>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(mut)]
  pub user: Signer<'info>,

  #[account(
    init,
    payer = user,
    space = 8 + 4 + MAX_CONTENT_LENGTH + 32 + 8
  )]
  pub post_account: Account<'info, Post>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UseAnaheim<'info> {
  #[account(mut)]
  pub anaheim: Account<'info, Anaheim>,
}

#[derive(Accounts)]
pub struct CloseAnaheim<'info> {
  #[account(mut, close = payer)]
  pub anaheim: Account<'info, Anaheim>,

  #[account(mut)]
  pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
  #[account(mut, close = user)]
  pub post_account: Account<'info, Post>,

  #[account(mut)]
  pub user: Signer<'info>,
}

#[account]
pub struct Anaheim {
  pub authority: Pubkey,
  pub count: u64,
  pub value: u64,
}

#[account]
pub struct User {
  pub name: String,
  pub user_authority: Pubkey,
}

#[account]
pub struct Post {
  pub content: String,
  pub author: Pubkey,
  pub timestamp: i64,
}