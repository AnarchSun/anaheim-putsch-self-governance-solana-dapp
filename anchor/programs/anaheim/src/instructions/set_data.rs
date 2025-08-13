// FILE: anchor/programs/anaheim/src/instructions/set_data.rs
use anchor_lang::prelude::*;
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(
        mut,
        // On vérifie que le signataire est bien l'autorité du compte
        has_one = authority
    )]
    pub anaheim_account: Account<'info, AnaheimAccount>,
    pub authority: Signer<'info>,
}

pub fn set_data_handler(ctx: Context<SetData>) -> Result<()> {
    let _anaheim_account = &mut ctx.accounts.anaheim_account;
    Ok(())
}