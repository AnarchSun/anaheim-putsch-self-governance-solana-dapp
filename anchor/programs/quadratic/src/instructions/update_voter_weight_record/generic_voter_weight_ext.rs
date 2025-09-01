use gpl_shared::generic_voter_weight::GenericVoterWeightEnum;
use solana_program::slot_history::Slot;

/// Extension trait pour simplifier l'accès aux champs communs
/// de GenericVoterWeightEnum (TokenOwnerRecord ou VoterWeightRecord).
pub trait GenericVoterWeightExt {
    fn get_voter_weight(&self) -> u64;
    fn get_voter_weight_expiry(&self) -> Option<Slot>;
}

impl GenericVoterWeightExt for GenericVoterWeightEnum {
    fn get_voter_weight(&self) -> u64 {
        match self {
            GenericVoterWeightEnum::TokenOwnerRecord(_record) => 0, // default
            GenericVoterWeightEnum::VoterWeightRecord(record) => record.voter_weight,
        }
    }

    fn get_voter_weight_expiry(&self) -> Option<Slot> {
        match self {
            GenericVoterWeightEnum::TokenOwnerRecord(_record) => None, // default
            GenericVoterWeightEnum::VoterWeightRecord(record) => record.voter_weight_expiry,
        }
    }
}

