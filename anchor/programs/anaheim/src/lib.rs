#![allow(deprecated)]
#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

// Program ID
declare_id!("DWiMeBh6xzNMCZq5eW7u67NRNaCkvGaQczcJSzpF5mC9");

// =========================================================================
//                          PROGRAM LOGIC
// =========================================================================
#[program]
pub mod anaheim {
    use super::*;

    // Create the user's PDA
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let anaheim_account = &mut ctx.accounts.anaheim_account;

        anaheim_account.authority = ctx.accounts.payer.key();
        anaheim_account.bump = ctx.bumps.anaheim_account;
        anaheim_account.count = 0;

        msg!("Anaheim account initialized for authority: {}", anaheim_account.authority);
        Ok(())
    }

    // Mine instruction
    pub fn mine(ctx: Context<UseAnaheim>) -> Result<()> {
        let account = &mut ctx.accounts.base.anaheim_account;
        account.count = account.count.checked_add(1).unwrap();
        msg!("Account mined! New count: {}", account.count);
        Ok(())
    }

    // Create stake
    pub fn create_stake(ctx: Context<CreateStake>) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.owner = ctx.accounts.user.key();
        stake_account.amount = 0;
        Ok(())
    }


    // Standard counter-instructions
    pub fn increment(ctx: Context<UseAnaheim>) -> Result<()> {
        let account = &mut ctx.accounts.base.anaheim_account;
        account.count = account.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn decrement(ctx: Context<UseAnaheim>) -> Result<()> {
        let account = &mut ctx.accounts.base.anaheim_account;
        account.count = account.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn set(ctx: Context<UseAnaheim>, value: u64) -> Result<()> {
        let account = &mut ctx.accounts.base.anaheim_account;
        account.count = value;
        Ok(())
    }
}

// =========================================================================
//                  INSTRUCTION CONTEXTS
// =========================================================================
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + AnaheimAccount::SIZE,
        seeds = [b"anaheim", payer.key().as_ref()],
        bump
    )]
    pub anaheim_account: Account<'info, AnaheimAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AnaheimAuthority<'info> {
    #[account(
        mut,
        has_one = authority,
        seeds = [b"anaheim", authority.key().as_ref()],
        bump = anaheim_account.bump
    )]
    pub anaheim_account: Account<'info, AnaheimAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UseAnaheim<'info> {
    pub base: AnaheimAuthority<'info>,
}

#[derive(Accounts)]
pub struct Mine<'info> {
    pub base: AnaheimAuthority<'info>,
}

#[derive(Accounts)]
pub struct CreateStake<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + StakeAccount::LEN,
        seeds = [b"stake", user.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


// =========================================================================
//                         ACCOUNT STATE
// =========================================================================
#[account]
#[derive(Default)]
pub struct AnaheimAccount {
    pub authority: Pubkey,
    pub bump: u8,
    pub count: u64,
}

impl AnaheimAccount {
    pub const SIZE: usize = 32 + 1 + 8;
}

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub amount: u64,
}

impl StakeAccount {
    pub const LEN: usize = 32 + 8; // owner + amount
}


// =========================================================================
//                         CUSTOM ERRORS
// =========================================================================
#[error_code]
pub enum CustomError {
    #[msg("This error is no longer used, but can be kept for future checks.")]
    InvalidBump,
}
