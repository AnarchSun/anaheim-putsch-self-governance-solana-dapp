#![allow(deprecated)]

use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod state;
pub mod handlers;
pub mod instructions;
pub mod post;
pub mod contexts;
pub mod close;
pub mod utils;

pub use instructions::*; // exposes instruction structs


declare_id!("CJSrfD5XGt4RkvGYZ8ooCUQfTPbPdZEqfPCo68K1Qxou");

#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let account = &mut ctx.accounts.anaheim;
    account.count = 0;
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

  pub fn create_post(_ctx: Context<CreatePost>, content: String) -> Result<()> {
    if content.len() > 280 {
      return err!(ErrorCode::ContentTooLong);
    }
    Ok(())
  }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(init, payer = payer, space = 8 + 8)]
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

#[derive(Accounts)]
pub struct CreatePost<'info> {
  #[account(init, payer = user, space = 8 + 280)]
  pub post_account: Account<'info, PostAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program<'info, System>,
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


#[account]
pub struct PostAccount {
  pub content: String,
}

#[error_code]
pub enum ErrorCode {
  #[msg("Content too long")]
  ContentTooLong,
}
