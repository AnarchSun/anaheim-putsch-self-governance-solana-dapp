// FILE: anchor/programs/anaheim/src/instructions/initialize.rs
use anchor_lang::prelude::*;

use crate::contexts::initialize::Initialize;

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
  let bump = ctx.bumps.anaheim; // ✅ PAS .get() !! Anchor a généré un champ `anaheim` directement.

  let anaheim = &mut ctx.accounts.anaheim;
  anaheim.bump = bump;
  anaheim.authority = *ctx.accounts.payer.key;
  anaheim.count = 0;
  anaheim.value = 0;

  Ok(())
}

