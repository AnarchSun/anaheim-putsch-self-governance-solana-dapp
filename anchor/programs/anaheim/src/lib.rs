// FILE: anchor/programs/anaheim/src/lib.rs
#![allow(unexpected_cfgs)]
#![allow(deprecated)]
use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod validate_post_content;


// Use your actual Program ID from Anchor.toml
declare_id!("4KRAAZb55vZqFC5zMoDQcdRfgC8gA263wEyFEH6wk8C2");

// =========================================================================
//                          THE MAIN PROGRAM LOGIC
// =========================================================================
#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let anaheim_account = &mut ctx.accounts.anaheim_account;
    let bump = ctx.bumps.anaheim_account; // Correctly get to bump from context

    anaheim_account.authority = ctx.accounts.payer.key();
    anaheim_account.bump = bump;
    anaheim_account.count = 0;

    msg!("Anaheim program account initialized!");
    Ok(())
  }

  pub fn increment(ctx: Context<UseAnaheim>) -> Result<()> {
    ctx.accounts.anaheim_account.count = ctx.accounts.anaheim_account.count.checked_add(1).unwrap();
    msg!("Count incremented to: {}", ctx.accounts.anaheim_account.count);
    Ok(())
  }

  pub fn decrement(ctx: Context<UseAnaheim>) -> Result<()> {
    ctx.accounts.anaheim_account.count = ctx.accounts.anaheim_account.count.checked_sub(1).unwrap();
    msg!("Count decremented to: {}", ctx.accounts.anaheim_account.count);
    Ok(())
  }

  pub fn set(ctx: Context<UseAnaheim>, value: u64) -> Result<()> {
    ctx.accounts.anaheim_account.count = value;
    msg!("Count set to: {}", value);
    Ok(())
  }
}

// =========================================================================
//                  INSTRUCTION CONTEXTS (THE ACCOUNTS)
// =========================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
        init,
        payer = payer,
        space = 8 + AnaheimAccount::SIZE,
        seeds = [b"anaheim", payer.key().as_ref()],
        bump
  )]
  pub anaheim_account: Account<'info, AnaheimAccount>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UseAnaheim<'info> {
  // This name is now consistent with the Initialize context.
  #[account(mut, has_one = authority)]
  pub anaheim_account: Account<'info, AnaheimAccount>,
  pub authority: Signer<'info>,
}

// =========================================================================
//                         ACCOUNT STATE (THE DATA)
// =========================================================================

#[account]
#[derive(Default)]
pub struct AnaheimAccount {
  pub authority: Pubkey, // 32 bytes
  pub bump: u8,          // 1 byte
  pub count: u64,        // 8 bytes
}

impl AnaheimAccount {
  pub const SIZE: usize = 32 + 1 + 8;
}