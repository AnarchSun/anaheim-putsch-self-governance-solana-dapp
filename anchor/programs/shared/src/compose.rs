use spl_token::solana_program::program_pack::Pack;
use spl_token::state::Mint;
use crate::{
    error::VoterWeightError,
    generic_max_voter_weight::GenericMaxVoterWeightEnum,
    generic_voter_weight::GenericVoterWeightEnum,
    mint::MintMaxVoterWeight,
};
use spl_governance::solana_program::program_error::ProgramError;

use anchor_lang::prelude::*;
 // we'll use fully qualified calls from solana_program when needed
use spl_governance::state::token_owner_record::get_token_owner_record_data_for_realm_and_governing_mint;
use spl_governance_tools::account::get_account_data;
use spl_governance::solana_program::pubkey::Pubkey as SgPubkey;
use spl_governance::solana_program::account_info::AccountInfo as SgAccountInfo;
use spl_governance::solana_program::clock::Slot;
use crate::generic_max_voter_weight::GenericMaxVoterWeight;
// ------------------------ helpers: AccountInfo reinterpret ------------------------

pub struct VoterWeightRecord {
    pub account_discriminator: [u8; 8],
    pub realm: Pubkey,
    pub governing_token_mint: Pubkey,
    pub governing_token_owner: Pubkey,
    pub voter_weight: u64,
    pub voter_weight_expiry: Option<Slot>,
    // ⚠️ no previous_voter_weight_plugin_program_id here in your version
}

/// Reinterpret Anchor AccountInfo as the solana_program AccountInfo used by spl crates (read-only).
pub trait ToSgAccountInfo<'a> {
    fn to_account_info_sg(&'a self) -> &'a AccountInfo<'a>;
}
impl<'a> ToSgAccountInfo<'a> for AccountInfo<'a> {
    #[inline(always)]
    fn to_account_info_sg(&'a self) -> &'a AccountInfo<'a> {
        // SAFETY: Anchor's AccountInfo and solana_program::AccountInfo have identical layout.
        // We only create a borrowed reference for read-only uses (no ownership transfer).
        unsafe { &*(self as *const AccountInfo) }
    }
}
// ... existing code ...

// ------------------------ traits needed by generic code ------------------------

pub trait RegistrarBase {
    fn get_realm(&self) -> Pubkey;
    fn get_governance_program_id(&self) -> Pubkey;
    fn get_governing_token_mint(&self) -> Pubkey;
    fn get_previous_voter_weight_plugin_program_id(&self) -> Option<Pubkey>;
}

pub trait VoterWeightRecordBase {
    fn get_governing_token_mint(&self) -> Pubkey;
    fn get_governing_token_owner(&self) -> Pubkey;
    fn get_realm(&self) -> Pubkey;
    fn get_previous_voter_weight_plugin_program_id(&self) -> Pubkey;
}

pub trait MaxVoterWeightRecordBase {
    fn get_governing_token_mint(&self) -> Pubkey;
}


impl VoterWeightRecordBase for GenericVoterWeightEnum {
    fn get_governing_token_mint(&self) -> Pubkey {
        todo!()
    }

    fn get_governing_token_owner(&self) -> Pubkey {
        todo!()
    }

    fn get_realm(&self) -> Pubkey {
        todo!()
    }

    fn get_previous_voter_weight_plugin_program_id(&self) -> Pubkey {
        match self {
            GenericVoterWeightEnum::TokenOwnerRecord(_) => {
                // ⚠️ This type does NOT have that field.
                // Decide: return a default, or error out.
                Pubkey::default()
            }
            GenericVoterWeightEnum::VoterWeightRecord(_r) => {
                Pubkey::default()
            }
        }
    }
}



// Forward Account<'_, T> to T when T implements the trait(s)
impl<'a, T> RegistrarBase for Account<'a, T>
where
    T: RegistrarBase + AccountSerialize + AccountDeserialize + Owner + Clone,
{
    fn get_realm(&self) -> Pubkey {
        (&**self).get_realm()
    }
    fn get_governance_program_id(&self) -> Pubkey {
        (&**self).get_governance_program_id()
    }
    fn get_governing_token_mint(&self) -> Pubkey {
        (&**self).get_governing_token_mint()
    }
    fn get_previous_voter_weight_plugin_program_id(&self) -> Option<Pubkey> {
        (&**self).get_previous_voter_weight_plugin_program_id()
    }
}

// ------------------------ core logic (byte-safe) ------------------------

pub fn resolve_input_voter_weight<'a, R, V>(
    input_account: &'a AccountInfo<'a>,           // <-- tie the lifetime to 'a
    voter_weight_record_to_update: &'a Account<V>,
    registrar: &'a Account<R>,
) -> Result<GenericVoterWeightEnum>
where
    R: RegistrarBase + AccountSerialize + AccountDeserialize + Owner + Clone,
    V: VoterWeightRecordBase + AccountSerialize + AccountDeserialize + Owner + Clone,
{
    let predecessor_generic_voter_weight_record =
        get_generic_voter_weight_record_data(input_account, registrar)?;

    // --- Compare by bytes (avoid cross-crate Pubkey equality issues) ---
    let (pred_mint_bytes, pred_owner_bytes, pred_realm_bytes) = match &predecessor_generic_voter_weight_record {
        GenericVoterWeightEnum::TokenOwnerRecord(r) => (
            r.governing_token_mint.to_bytes(),
            r.governing_token_owner.to_bytes(),
            r.realm.to_bytes(),
        ),
        GenericVoterWeightEnum::VoterWeightRecord(r) => (
            r.governing_token_mint.to_bytes(),
            r.governing_token_owner.to_bytes(),
            r.realm.to_bytes(),
        ),
    };

    let update_mint_bytes = voter_weight_record_to_update
        .get_governing_token_mint()
        .to_bytes();
    if update_mint_bytes != pred_mint_bytes {
        return Err(error!(VoterWeightError::InvalidPredecessorVoterWeightRecordGovTokenMint));
    }

    let update_owner_bytes = voter_weight_record_to_update
        .get_governing_token_owner()
        .to_bytes();
    if update_owner_bytes != pred_owner_bytes {
        return Err(error!(VoterWeightError::InvalidPredecessorVoterWeightRecordGovTokenOwner));
    }

    let realm_bytes = registrar.get_realm().to_bytes();
    if realm_bytes != pred_realm_bytes {
        return Err(error!(VoterWeightError::InvalidPredecessorVoterWeightRecordRealm));
    }

    Ok(predecessor_generic_voter_weight_record)
}


// --- helper to produce the exact Pubkey type spl_governance expects ---
#[inline(always)]
fn anchor_to_sg_pubkey(anchor: &Pubkey) -> SgPubkey {
    SgPubkey::new_from_array(anchor.to_bytes())
}

// --- replace get_generic_voter_weight_record_data with this version ---
fn get_generic_voter_weight_record_data<'a, R>(
    input_account: &'a AccountInfo<'a>,
    registrar: &'a Account<R>,
) -> Result<GenericVoterWeightEnum>
where
    R: RegistrarBase + AccountSerialize + AccountDeserialize + Owner + Clone,
{
    match registrar.get_previous_voter_weight_plugin_program_id() {
        None => {
            // build SgPubkey values expected by spl-governance helper
            let governance_sg: SgPubkey = anchor_to_sg_pubkey(&registrar.get_governance_program_id());
            let realm_sg: SgPubkey = anchor_to_sg_pubkey(&registrar.get_realm());
            let governing_mint_sg: SgPubkey = anchor_to_sg_pubkey(&registrar.get_governing_token_mint());

            // reinterpret the Anchor AccountInfo as the AccountInfo type used by spl_governance
            let input_sg: &SgAccountInfo = unsafe {
                // SAFETY: Anchor AccountInfo and spl_governance::solana_program::account_info::AccountInfo
                // have identical repr; we only borrow for read-only deserialization.
                &*(input_account as *const AccountInfo as *const SgAccountInfo)
            };

            let record = get_token_owner_record_data_for_realm_and_governing_mint(
                &governance_sg,
                input_sg,
                &realm_sg,
                &governing_mint_sg,
            )
                .map_err(|_| error!(VoterWeightError::InvalidPredecessorTokenOwnerRecord))?;

            Ok(GenericVoterWeightEnum::TokenOwnerRecord(record))
        }
        Some(predecessor_anchor_pubkey) => {
            // predecessor is Anchor Pubkey — convert to the spl_governance pubkey type
            let predecessor_sg: SgPubkey = anchor_to_sg_pubkey(&predecessor_anchor_pubkey);

            // reinterpret AccountInfo as SgAccountInfo for the get_account_data call
            let input_sg: &SgAccountInfo = unsafe {
                &*(input_account as *const AccountInfo as *const SgAccountInfo)
            };

            let record: spl_governance_addin_api::voter_weight::VoterWeightRecord =
                get_account_data(&predecessor_sg, input_sg)
                    .map_err(|_| error!(VoterWeightError::InvalidPredecessorVoterWeightRecord))?;

            Ok(GenericVoterWeightEnum::VoterWeightRecord(record))
        }
    }
}

fn parse_input_max_voter_weight_as_mint(
    input_account: &AccountInfo,
) -> Result<GenericMaxVoterWeightEnum> {
    // If there is no predecessor plugin registrar, then the input account must be a Mint
    let src = input_account.try_borrow_data()?;
    let data: &[u8] = &src;
    let mint: Mint = Mint::unpack_from_slice(data)
        .map_err(|_| error!(VoterWeightError::InvalidPredecessorTokenOwnerRecord))?;

    Ok(GenericMaxVoterWeightEnum::Mint(MintMaxVoterWeight {
        mint,
        key: *input_account.key,
    }))
}
// ... existing code ...

fn get_generic_max_voter_weight_record_data<
    'a,
    R: RegistrarBase + AccountSerialize + AccountDeserialize + Owner + Clone,
>(
    input_account: &'a AccountInfo,
    registrar: &'a Account<R>,
) -> Result<GenericMaxVoterWeightEnum> {
    match registrar.get_previous_voter_weight_plugin_program_id() {
        None => parse_input_max_voter_weight_as_mint(input_account),
        Some(predecessor) => {
            // If there is a predecessor plugin registrar, then the input account may be either a VoterWeightRecord or a Mint.
            // Try to parse it as a VoterWeightRecord first.
            // if that fails, try to parse it as a Mint.

            // Convert Anchor types to Solana program types
            let predecessor_sg = anchor_to_sg_pubkey(&predecessor);
            let input_sg = unsafe {
                &*(input_account as *const AccountInfo as *const SgAccountInfo)
            };

            let record: core::result::Result<
                spl_governance_addin_api::max_voter_weight::MaxVoterWeightRecord,
                ProgramError,
            > = get_account_data(&predecessor_sg, input_sg);

            match record {
                Ok(record) => Ok(GenericMaxVoterWeightEnum::MaxVoterWeightRecord(record)),
                Err(_) => parse_input_max_voter_weight_as_mint(input_account),
            }
        }
    }
}
pub fn resolve_input_max_voter_weight<
    'a,
    R: RegistrarBase + AccountSerialize + AccountDeserialize + Owner + Clone,
    V: VoterWeightRecordBase + AccountSerialize + AccountDeserialize + Owner + Clone,
>(
    input_account: &'a AccountInfo,
    max_voter_weight_record_to_update: &'a Account<V>,
    registrar: &'a Account<R>,
) -> Result<GenericMaxVoterWeightEnum> {
    let predecessor_generic_max_voter_weight_record =
        get_generic_max_voter_weight_record_data(input_account, registrar)?;
    // ... existing code ...

    // ensure that the correct governance token mint is used
    let _pred_mint: Pubkey = match &predecessor_generic_max_voter_weight_record {
        GenericMaxVoterWeightEnum::MaxVoterWeightRecord(r) => r.get_governing_token_mint(),
        GenericMaxVoterWeightEnum::Mint(m) => m.key,
    };
    // Rust
    require_keys_eq!(
    max_voter_weight_record_to_update.get_governing_token_mint(),
    predecessor_generic_max_voter_weight_record.governing_token_mint(),
    VoterWeightError::InvalidPredecessorVoterWeightRecordGovTokenMint
);

    // ... existing code ...

    Ok(predecessor_generic_max_voter_weight_record)
}
