#![allow(unexpected_cfgs)]
#![allow(deprecated)]
use anchor_lang::prelude::*;

// NOTE: These modules are good practice but were not provided,
// so I've commented them out. If you have them, you can uncomment them.
// pub mod constants;
// pub mod error;
// pub mod validate_post_content;

// Use your actual Program ID from Anchor.toml
declare_id!("B1cHVNAFWYX3zXZjqi2tubPZGzrLQEAiL5A9URqKskFi");

// =========================================================================
//                          THE MAIN PROGRAM LOGIC
// =========================================================================
#[program]
pub mod anaheim {
  use super::*;

  // The function signature now uses the concrete 'Initialize' struct defined below.
  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let anaheim_account = &mut ctx.accounts.anaheim_account;

    // THE FIX: Access the bump directly as a property.
    // The property name matches the account field name in your 'Initialize' struct.
    anaheim_account.bump = ctx.bumps.anaheim_account;

    // The rest of your logic remains the same.
    anaheim_account.authority = ctx.accounts.payer.key();
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

// FIX: This is the missing piece.
// This struct tells Anchor everything it needs to know to run the `initialize` instruction.
#[derive(Accounts)]
pub struct Initialize<'info> {
  // 1. We are creating ('init') a new account.
  // 2. The 'payer' for the account creation is the `payer` account defined below.
  // 3. We allocate 'space' on-chain: 8 bytes for Anchor's discriminator + the size of our struct.
  // 4. We define this as a PDA with 'seeds' and a 'bump'.
  #[account(
        init,
        payer = payer,
        space = 8 + AnaheimAccount::SIZE,
        seeds = [b"anaheim".as_ref(), payer.key().as_ref()], // Seeds for the PDA
        bump
  )]
  pub anaheim_account: Account<'info, AnaheimAccount>,

  // The user who is paying for the transaction and new account.
  // They must sign the transaction and their account must be mutable to be debited.
  #[account(mut)]
  pub payer: Signer<'info>,

  // The System Program is required by Solana to create new accounts.
  pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct UseAnaheim<'info> {
  #[account(
        mut,
        has_one = authority, // Ensures the signer is the authority stored on the account
        seeds = [b"anaheim".as_ref(), authority.key().as_ref()], // We must re-provide seeds to find the PDA
        bump = anaheim_account.bump // And we must provide the stored bump to validate the PDA
  )]
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
  // The total size of the account data.
  pub const SIZE: usize = 32 + 1 + 8;
}