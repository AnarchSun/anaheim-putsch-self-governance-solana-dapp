// ===================== contexts/update.rs =====================
// FILE: anchor/programs/anaheim/src/contexts/update.rs
use anchor_lang::prelude::*;
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct UpdatePost<'info> { // Or a better name like `UpdateAnaheim`
  #[account(mut)]
  // This field name 'anaheim' matches `ctx.accounts.anaheim`
  pub anaheim: Account<'info, AnaheimAccount>,
}