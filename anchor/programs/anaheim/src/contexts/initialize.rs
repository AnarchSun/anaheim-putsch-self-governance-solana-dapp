<<<<<<< HEAD
// FILE: anchor/programs/anaheim/src/contexts/initialize.rs
=======
// FILE: anchor/programs/anaheim-old/src/contexts/initialize.rs
>>>>>>> main
use anchor_lang::prelude::*;
use crate::state::anaheim_account::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
<<<<<<< HEAD
  #[account(init, payer = payer, space = AnaheimAccount::SIZE)]
  pub anaheim: Account<'info, AnaheimAccount>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
}
=======
    #[account(
        init,
        payer = payer,
        seeds = [b"anaheim-old", payer.key().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<AnaheimAccount>()
    )]
    pub anaheim: Account<'info, AnaheimAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
>>>>>>> main
