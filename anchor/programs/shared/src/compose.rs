use crate::{
    error::VoterWeightError,
    generic_max_voter_weight::{GenericMaxVoterWeight, GenericMaxVoterWeightEnum},
    generic_voter_weight::{GenericVoterWeight, GenericVoterWeightEnum},
    mint::MintMaxVoterWeight,
};
use anchor_lang::prelude::{Account, ProgramError, Pubkey};
use anchor_lang::prelude::AccountInfo as AnchorAccountInfo;
use anchor_lang::solana_program::program_pack::Pack;
use anchor_lang::{error, AccountDeserialize, AccountSerialize, Owner, Result, require_eq};
use anchor_lang::solana_program::entrypoint::__AccountInfo;
use spl_governance::state::token_owner_record::get_token_owner_record_data_for_realm_and_governing_mint;
use spl_governance_tools::account::get_account_data;
use spl_token::state::Mint;

// ===================== Conversion Helpers =====================

pub trait ToSgPubkey {
    fn to_sg_pubkey(&self) -> spl_governance::solana_program::pubkey::Pubkey;
}

impl ToSgPubkey for Pubkey {
    fn to_sg_pubkey(&self) -> spl_governance::solana_program::pubkey::Pubkey {
        spl_governance::solana_program::pubkey::Pubkey::new_from_array(self.to_bytes())
    }
}

pub trait ToSgAccountInfo<'a> {
    fn to_sg_account_info(&'a self) -> &'a spl_governance::solana_program::account_info::AccountInfo<'a>;
}

impl<'a> ToSgAccountInfo<'a> for AnchorAccountInfo<'a> {
    fn to_sg_account_info(&'a self) -> &'a spl_governance::solana_program::account_info::AccountInfo<'a> {
        unsafe { &*(self as *const _ as *const spl_governance::solana_program::account_info::AccountInfo) }
    }
}

pub trait ToSgProgramError {
    fn to_sg(&self) -> spl_governance::solana_program::program_error::ProgramError;
}

impl ToSgProgramError for ProgramError {
    fn to_sg(&self) -> spl_governance::solana_program::program_error::ProgramError {
        match self {
            ProgramError::Custom(c) => spl_governance::solana_program::program_error::ProgramError::Custom(*c),
            _ => spl_governance::solana_program::program_error::ProgramError::Custom(999),
        }
    }
}

// ===================== Traits =====================

pub trait RegistrarBase<'a> {
    fn get_realm(&'a self) -> &'a Pubkey;
    fn get_governance_program_id(&'a self) -> &'a Pubkey;
    fn get_governing_token_mint(&'a self) -> &'a Pubkey;
    fn get_previous_voter_weight_plugin_program_id(&'a self) -> &'a Option<Pubkey>;
}

pub trait VoterWeightRecordBase<'a> {
    fn get_governing_token_mint(&'a self) -> &'a Pubkey;
    fn get_governing_token_owner(&'a self) -> &'a Pubkey;
}

pub trait MaxVoterWeightRecordBase<'a> {
    fn get_governing_token_mint(&'a self) -> &'a Pubkey;
}

// ===================== Voter Weight =====================

pub fn resolve_input_voter_weight<
    'a,
    R: RegistrarBase<'a> + AccountSerialize + AccountDeserialize + Owner + Clone,
    V: VoterWeightRecordBase<'a> + AccountSerialize + AccountDeserialize + Owner + Clone,
>(
    input_account: &'a __AccountInfo<'a>,
    voter_weight_record_to_update: &'a Account<V>,
    registrar: &'a Account<R>,
) -> Result<GenericVoterWeightEnum> {
    let predecessor_generic_voter_weight_record =
        get_generic_voter_weight_record_data(input_account, registrar)?;

    require_eq!(
        voter_weight_record_to_update.get_governing_token_mint(),
        &predecessor_generic_voter_weight_record.get_governing_token_mint(),
        VoterWeightError::InvalidPredecessorVoterWeightRecordGovTokenMint
    );

    require_eq!(
        voter_weight_record_to_update.get_governing_token_owner(),
        &predecessor_generic_voter_weight_record.get_governing_token_owner(),
        VoterWeightError::InvalidPredecessorVoterWeightRecordGovTokenOwner
    );

    require_eq!(
        registrar.get_realm(),
        &predecessor_generic_voter_weight_record.get_realm(),
        VoterWeightError::InvalidPredecessorVoterWeightRecordRealm
    );

    Ok(predecessor_generic_voter_weight_record)
}

fn get_generic_voter_weight_record_data<
    'a,
    R: RegistrarBase<'a> + AccountSerialize + AccountDeserialize + Owner + Clone,
>(
    input_account: &'a __AccountInfo<'a>,
    registrar: &'a Account<R>,
) -> Result<GenericVoterWeightEnum> {
    match registrar.get_previous_voter_weight_plugin_program_id() {
        None => {
            // Convert once to SPL Governance Pubkeys
            let governance_program_id_sg = registrar.get_governance_program_id().to_sg_pubkey();
            let realm_sg = registrar.get_realm().to_sg_pubkey();
            let governing_token_mint_sg = registrar.get_governing_token_mint().to_sg_pubkey();

            // Then pass references
            let record = get_token_owner_record_data_for_realm_and_governing_mint(
                &governance_program_id_sg,
                input_account.to_sg_account_info(),
                &realm_sg,
                &governing_token_mint_sg,
            )
                .map_err(|_| error!(VoterWeightError::InvalidPredecessorTokenOwnerRecord))?;


            Ok(GenericVoterWeightEnum::TokenOwnerRecord(record))
        }
        Some(predecessor) => {
            let record: spl_governance_addin_api::voter_weight::VoterWeightRecord =
                get_account_data(
                    &predecessor.to_sg_pubkey(),
                    input_account.to_sg_account_info(),
                )
                    .map_err(|_| error!(VoterWeightError::InvalidPredecessorVoterWeightRecord))?;

            Ok(GenericVoterWeightEnum::VoterWeightRecord(record))
        }
    }
}

// ===================== Max Voter Weight =====================

fn get_generic_max_voter_weight_record_data<
    'a,
    R: RegistrarBase<'a> + AccountSerialize + AccountDeserialize + Owner + Clone,
>(
    input_account: &'a __AccountInfo<'a>,
    registrar: &'a Account<R>,
) -> Result<GenericMaxVoterWeightEnum> {
    match registrar.get_previous_voter_weight_plugin_program_id() {
        None => parse_input_max_voter_weight_as_mint(input_account),
        Some(predecessor) => {
            let record: spl_governance_addin_api::max_voter_weight::MaxVoterWeightRecord =
                get_account_data(
                    &predecessor.to_sg_pubkey(),
                    input_account.to_sg_account_info(),
                )
                    .map_err(|_| error!(VoterWeightError::InvalidPredecessorVoterWeightRecord))?;

            Ok(GenericMaxVoterWeightEnum::MaxVoterWeightRecord(record))
        }
    }
}

fn parse_input_max_voter_weight_as_mint(
    input_account: &AnchorAccountInfo,
) -> Result<GenericMaxVoterWeightEnum> {
    let src = input_account.try_borrow_data().map_err(|_| error!(VoterWeightError::InvalidPredecessorTokenOwnerRecord))?;
    let data: &[u8] = *src;
    let mint = Mint::unpack_from_slice(data)
        .map_err(|_| error!(VoterWeightError::InvalidPredecessorTokenOwnerRecord))?;

    Ok(GenericMaxVoterWeightEnum::Mint(MintMaxVoterWeight {
        mint,
        key: *input_account.key,
    }))
}

pub fn resolve_input_max_voter_weight<
    'a,
    R: RegistrarBase<'a> + AccountSerialize + AccountDeserialize + Owner + Clone,
    V: MaxVoterWeightRecordBase<'a> + AccountSerialize + AccountDeserialize + Owner + Clone,
>(
    input_account: &'a __AccountInfo<'a>,
    max_voter_weight_record_to_update: &'a Account<V>,
    registrar: &'a Account<R>,
) -> Result<GenericMaxVoterWeightEnum> {
    let predecessor_generic_max_voter_weight_record =
        get_generic_max_voter_weight_record_data(input_account, registrar)?;

    require_eq!(
        max_voter_weight_record_to_update.get_governing_token_mint(),
        &predecessor_generic_max_voter_weight_record.get_governing_token_mint(),
        VoterWeightError::InvalidPredecessorVoterWeightRecordGovTokenMint
    );

    Ok(predecessor_generic_max_voter_weight_record)
}
