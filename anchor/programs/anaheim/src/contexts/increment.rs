// FILE: anchor/programs/anaheim/src/handlers/increment.rs
use anchor_lang::prelude::*;
use crate::instructions::use_anaheim::UseAnaheim;
use crate::error::ErrorCode;
pub fn handle_increment(ctx: Context<UseAnaheim>) -> Result<()> {
    ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_add(1).ok_or(ErrorCode::Overflow)?;
    Ok(())
}