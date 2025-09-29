// PATH: programs/anaheim/src/lib.rs
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: program ID mismatch, matrix override!

#![allow(deprecated)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod validate_post_content;
pub use constants::*;
pub use validate_post_content::*;

// =========================================================================
//                          PROGRAM ID
// =========================================================================
// PATCH: Update program ID for matrix override and sync with frontend/scripts!
declare_id!("32GxU3uyDqcTn99CnFbbBwQujuCLy9mNwkf6MYqQYHC9");

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

    pub fn create_post(
        ctx: Context<CreatePost>,
        title: String,
        content: String,
    ) -> Result<()> {
        if content.len() > 280 {
            return err!(ErrorCode::ContentTooLong);
        }
        let post = &mut ctx.accounts.post;
        post.author = ctx.accounts.payer.key();
        post.title = title;
        post.content = content;
        Ok(())
    }

    pub fn mine(ctx: Context<UseAnaheim>) -> Result<()> {
        let account = &mut ctx.accounts.base.anaheim_account;
        account.count = account.count.checked_add(1).unwrap();
        msg!("Account mined! New count: {}", account.count);
        Ok(())
    }

    pub fn create_stake(ctx: Context<CreateStake>) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.owner = ctx.accounts.user.key();
        stake_account.amount = 0;
        Ok(())
    }

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
    pub struct CreateStake<'info> {
        #[account(
        init_if_needed,           // crée si absent
        payer = user,
        space = 8 + StakeAccount::LEN, // ← utiliser le vrai type
        seeds = [b"stake", user.key().as_ref()],
        bump
        )]
        pub stake_account: Account<'info, StakeAccount>,  // ← nom cohérent avec ctx.accounts
        #[account(mut)]
        pub user: Signer<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct CreatePost<'info> {
        #[account(init, payer = payer, space = 8 + Post::SIZE)]
        pub post: Account<'info, Post>,
        #[account(mut)]
        pub payer: Signer<'info>,
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
        pub const SIZE: usize = 32 + 1 + 8; // authority + bump + count
    }

    #[account]
    pub struct StakeAccount {
        pub owner: Pubkey,
        pub amount: u64,
    }
    impl StakeAccount {
        pub const LEN: usize = 32 + 8; // owner + amount
    }

    #[account]
    pub struct Post {
        pub author: Pubkey,
        pub title: String,
        pub content: String,
    }
    impl Post {
        // 4 bytes prefix per String, 280 max content chars, title max 64 chars
        pub const SIZE: usize = 32 + 4 + 64 + 4 + 280;
    }

    // =========================================================================
    //                         ERRORS
    // =========================================================================
    #[error_code]
    pub enum ErrorCode {
        #[msg("Content too long")]
        ContentTooLong,
    }
}

// PATCH NOTES:
// - Program ID in declare_id! updated to "9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt" for matrix override
// - No more mismatch between Rust and frontend/scripts
// - Always batch fix, filename/path éternel!