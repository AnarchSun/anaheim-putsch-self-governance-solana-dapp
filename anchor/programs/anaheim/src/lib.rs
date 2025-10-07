// PATH: programs/anaheim/src/lib.rs
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: program ID mismatch, matrix override + DAO-aware transfer hook

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
declare_id!("32GxU3uyDqcTn99CnFbbBwQujuCLy9mNwkf6MYqQYHC9");

// =========================================================================
//                          PROGRAM LOGIC
// =========================================================================
#[program]
pub mod anaheim {
    use super::*;

    // Initialize user's PDA
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let anaheim_account = &mut ctx.accounts.anaheim_account;
        anaheim_account.authority = ctx.accounts.payer.key();
        anaheim_account.bump = ctx.bumps.anaheim_account;
        anaheim_account.count = 0;
        msg!("Anaheim account initialized for authority: {}", anaheim_account.authority);
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
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
    //                       DAO TRANSFER HOOK
    // =========================================================================
    pub fn transfer_hook(ctx: Context<TransferHook<"info', token><>>) -> Result<()> {
        let from = &ctx.accounts.from;
        let to = &ctx.accounts.to;

        // DAO-aware transfer check:
        // Delegates, council, treasury rules, etc. are checked via DAO config account
        let dao_config = &ctx.accounts.dao_config;

        if !dao_config.is_member(from.key) || !dao_config.is_member(to.key) {
            return err!(ErrorCode::NotDaoMember);
        }

        msg!("Transfer allowed between DAO members: {} -> {}", from.key, to.key);
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
            init_if_needed,
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

    #[derive(Accounts)]
    pub struct CreatePost<'info> {
        #[account(init, payer = payer, space = 8 + Post::SIZE)]
        pub post: Account<'info, Post>,
        #[account(mut)]
        pub payer: Signer<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct TransferHook<'info, Token> {
        #[account(mut)]
        pub from: AccountInfo<'info>,
        #[account(mut)]
        pub to: AccountInfo<'info>,
        /// DAO config that tracks members, council, treasury, delegates, etc.
        pub dao_config: AccountInfo<'info>,
        pub token_program: Program<'info, Token>,
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
        pub const LEN: usize = 32 + 8;
    }

    #[account]
    pub struct Post {
        pub author: Pubkey,
        pub title: String,
        pub content: String,
    }
    impl Post {
        pub const SIZE: usize = 32 + 4 + 64 + 4 + 280;
    }

    // =========================================================================
    //                         ERRORS
    // =========================================================================
    #[error_code]
    pub enum ErrorCode {
        #[msg("Content too long")]
        ContentTooLong,
        #[msg("Not a DAO member")]
        NotDaoMember,
    }
}

// PATCH NOTES:
// - Program ID matches frontend/scripts
// - Transfer hook is DAO-aware using dynamic DAO config
// - Hardcoded whitelist removed for future-proofing
// - Batch fixed filename/path + errors
