// anchor/programs/anaheim/src/lib.rs
#![allow(deprecated)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey::Pubkey;

pub mod error;
use crate::program::Anaheim;
pub use error::ErrorCode;
pub mod constants;
mod validate_post_content;

declare_id!("DV7eTRbWHnDjgh6uHGo6k8ExXBvgWEVPNNqSmdGrXAnJ");

pub const ANAHEIM_IDL_ID: Pubkey = Pubkey::new_from_array([
    132, 157, 218, 39, 146, 184, 154, 229, 157, 208, 222, 217, 179, 105, 214, 114,
    145, 251, 14, 120, 48, 169, 34, 96, 132, 73, 172, 248, 93, 142, 25, 203,
]);

pub const MAX_CONTENT_LENGTH: usize = 256;
pub const MAX_USERNAME_LENGTH: usize = 32;

pub trait IdlInstruction {
    fn id() -> Pubkey;
}

/// ─── ACCOUNT STATES ──────────────────────────────────────────────────────────
#[account]
#[derive(Default)]
pub struct AnaheimAccount {
    pub authority: Pubkey,
    pub bump: u8,
    pub count: u64,
    pub value: u8,
}
impl AnaheimAccount {
    pub const SIZE: usize = 32 + 1 + 8 + 1; // authority + bump + count + value
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

/// ─── CONTEXTS ───────────────────────────────────────────────────────────────
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

#[derive(Accounts)]
pub struct ClosePost<'info> {
    #[account(mut, close = user)]
    pub post_account: Account<'info, PostAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = AnaheimAccount::SIZE)]
    pub anaheim: Account<'info, AnaheimAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// ─── PROGRAM ────────────────────────────────────────────────────────────────
#[program]
pub mod anaheim {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
        let anaheim_account = &mut ctx.accounts.anaheim;
        anaheim_account.bump = bump;
        anaheim_account.authority = *ctx.accounts.payer.key;
        anaheim_account.count = 0;
        anaheim_account.value = 0;
        Ok(())
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

        msg!("Post created by {:?} at {}", post_account.author, post_account.timestamp);
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

    pub fn close_anaheim(_ctx: Context<CloseAnaheim>) -> Result<()> {
        Ok(())
    }

    pub fn close_post(_ctx: Context<ClosePost>) -> Result<()> {
        msg!("Account will be closed!");
        Ok(())
    }
}

/// IDL Instruction impl
impl IdlInstruction for Anaheim {
    fn id() -> Pubkey {
        ANAHEIM_IDL_ID
    }
}
