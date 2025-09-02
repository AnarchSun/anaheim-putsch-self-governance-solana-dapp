#![allow(unexpected_cfgs)]

mod generic_voter_weight_ext;
use crate::error::QuadraticError;
use crate::state::*;
use crate::util::convert_vote;
// Impl du trait pour l’account Anchor VoterWeightRecord.
// IMPORTANT: utiliser le Pubkey d’Anchor (anchor_lang::prelude::Pubkey)
// IMPORTANT: utiliser Pubkey d’Anchor, pas un module inventé.
use anchor_lang::prelude::Pubkey;
use anchor_lang::prelude::*;
use gpl_shared::generic_voter_weight::{GenericVoterWeight, GenericVoterWeightEnum};
use anchor_lang::solana_program::clock::Clock;
use std::cmp::max;

/// Base trait for voter weight records
pub trait VoterWeightRecordBase {
    fn get_governing_token_mint(&self) -> Pubkey;
    fn get_governing_token_owner(&self) -> Pubkey;
    fn get_realm(&self) -> Pubkey;
    fn get_previous_voter_weight_plugin_program_id(&self) -> Option<Pubkey>;
}

/// Implement the trait for VoterWeightRecord
impl VoterWeightRecordBase for VoterWeightRecord {
    fn get_governing_token_mint(&self) -> Pubkey {
        // Clone because the trait returns by value
        Pubkey::new_from_array(self.governing_token_mint.to_bytes())
    }

    fn get_governing_token_owner(&self) -> Pubkey {
        Pubkey::new_from_array(self.governing_token_owner.to_bytes())
    }

    fn get_realm(&self) -> Pubkey {
        Pubkey::new_from_array(self.realm.to_bytes())
    }

    fn get_previous_voter_weight_plugin_program_id(&self) -> Option<Pubkey> {
        // VoterWeightRecord has no previous plugin info, so return None
        None
    }
}
/// Updates VoterWeightRecord to evaluate governance power for non-voting use cases
#[derive(Accounts)]
pub struct UpdateVoterWeightRecord<'info> {
    pub registrar: Account<'info, Registrar>,

    /// Either TokenOwnerRecordV2 or VoterWeightRecord
    /// CHECK: validated in code
    pub input_voter_weight: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = voter_weight_record.realm == registrar.realm
            @ QuadraticError::InvalidVoterWeightRecordRealm,
        constraint = voter_weight_record.governing_token_mint == registrar.governing_token_mint
            @ QuadraticError::InvalidVoterWeightRecordMint,
    )]
    pub voter_weight_record: Account<'info, VoterWeightRecord>,
}

pub fn resolve_input_voter_weight<'a, R, V>(
    _input_account: &'a AccountInfo<'a>,
    _voter_weight_record_to_update: &'a Account<V>,
    _registrar: &'a Account<R>,
) -> Result<GenericVoterWeightEnum> {
    todo!()
}

// top-level function
pub fn update_voter_weight_record(ctx: Context<UpdateVoterWeightRecord>) -> Result<()> {
    let voter_weight_record = &mut ctx.accounts.voter_weight_record;

    // Anchor AccountInfo
    let input_account = ctx.accounts.input_voter_weight.to_account_info();

    // Call your resolver
    let input_voter_weight_record = resolve_input_voter_weight(
        &input_account,
        voter_weight_record,
        &ctx.accounts.registrar,
    )?;

    let coefficients = &ctx.accounts.registrar.quadratic_coefficients;

    let output_voter_weight =
        convert_vote(GenericVoterWeight::get_voter_weight(&input_voter_weight_record), coefficients) as u64;

    msg!(
        "input weight: {}. output weight {}. coefficients: {:?}",
        GenericVoterWeight::get_voter_weight(&input_voter_weight_record),
        output_voter_weight,
        coefficients
    );

    voter_weight_record.voter_weight = output_voter_weight;

    let current_slot = Clock::get()?.slot;
    voter_weight_record.voter_weight_expiry =
        GenericVoterWeight::get_voter_weight_expiry(&input_voter_weight_record)
            .map_or(Some(current_slot), |prev| Some(max(prev, current_slot)));

    Ok(())
}



