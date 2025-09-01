extern crate core;

pub mod anchor;
pub mod compose;
pub mod error;
pub mod generic_max_voter_weight;
pub mod generic_voter_weight;
pub mod mint;
pub mod token_owner_record;
// FILE: shared/src/lib.rs

pub const DISCRIMINATOR_SIZE: usize = 8;
pub const PUBKEY_SIZE: usize = 32;

/// Size of voter weight record (generic)
pub const VOTER_WEIGHT_RECORD_SIZE: usize =
    DISCRIMINATOR_SIZE + PUBKEY_SIZE * 4 + 8 + 1 + 8 + 1 + 1 + 1 + 8;
