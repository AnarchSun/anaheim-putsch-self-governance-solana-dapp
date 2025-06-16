// src/hooks/fetchStakeActivation.ts
import { stakeAccountCodec, StakeActivationState } from '@/hooks/stake/stake-codecs';
import { PublicKey, Connection } from '@solana/web3.js';

export class getStakeActivationSafe {
  state: StakeActivationState | null = null;
  private _pubkey: PublicKey;
  private _connection: Connection;
  private _programId?: PublicKey;

  constructor(connection: Connection, pubkey: PublicKey, programId?: PublicKey) {
    this._connection = connection;
    this._pubkey = pubkey;
    this._programId = programId;
  }

  async fetch() {
    try {
      const accountInfo = await this._connection.getAccountInfo(this._pubkey);

      if (!accountInfo || !accountInfo.data) {
        this.state = 'uninitialized';
        return;
      }

      const decodedStakeAccount = stakeAccountCodec.decode(accountInfo.data);

      const delegation = decodedStakeAccount.stake.delegation;
      const currentEpoch = await this._connection.getEpochInfo().then(info => info.epoch);

      if (delegation.deactivationEpoch === BigInt('18446744073709551615')) {
        this.state = 'active';
      } else if (delegation.activationEpoch > BigInt(currentEpoch)) {
        this.state = 'activating';
      } else if (delegation.deactivationEpoch < BigInt(currentEpoch)) {
        this.state = 'inactive';
      } else if (delegation.deactivationEpoch >= BigInt(currentEpoch)) {
        this.state = 'deactivating';
      } else {
        this.state = 'uninitialized';
      }
    } catch (error) {
      this.state = null;
      throw error;
    }
  }

}
