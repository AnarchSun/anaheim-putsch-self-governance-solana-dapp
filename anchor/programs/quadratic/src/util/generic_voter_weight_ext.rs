use gpl_shared::generic_voter_weight::GenericVoterWeightEnum;

/// Trait pour uniformiser l’accès au poids et à l’expiration du vote
pub trait GenericVoterWeightExt {
    fn get_voter_weight(&self) -> u64;
    fn get_voter_weight_expiry(&self) -> Option<Slot>;
}

impl GenericVoterWeightExt for GenericVoterWeightEnum {
    fn get_voter_weight(&self) -> u64 {
        match self {
            // TokenOwnerRecordV2 n’a pas voter_weight => on retourne 0
            GenericVoterWeightEnum::TokenOwnerRecord(_record) => 0,
            GenericVoterWeightEnum::VoterWeightRecord(record) => record.voter_weight,
        }
    }

    fn get_voter_weight_expiry(&self) -> Option<Slot> {
        match self {
            // TokenOwnerRecordV2 n’a pas voter_weight_expiry => None
            GenericVoterWeightEnum::TokenOwnerRecord(_record) => None,
            GenericVoterWeightEnum::VoterWeightRecord(record) => record.voter_weight_expiry,
        }
    }
}
