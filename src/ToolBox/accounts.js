import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';
import { Account_Type } from '../constants/onchain';

//generate and return seed phrase function
function GenerateSeedPhrase() {
  console.log('seed generation started!');
  try {
    const seed = mnemonicGenerate(12);
    console.log('seed generated!', { seed });
    return seed;
  } catch (error) {
    console.log('ERROR IN GenerateSeedPhrase', error);
  }
}

//create account from seed phrase function
function AccountCreation({ name, password, seed }) {
  try {
    const { pair, json } = keyring.addUri(
      seed,
      password,
      { name },
      Account_Type,
    );
    return { pair, json, seed };
  } catch (error) {
    console.log('ERROR IN AccountCreation', error);
  }
}

//initializing keyring module
//need to invoke this function in background.js script
function KeyringInitialization() {
  cryptoWaitReady()
    .then(() => {
      console.log('crypto initialized');

      // load all the keyring data
      keyring.loadAll({ ss58Format: 42, type: Account_Type });

      console.log('INITIALIZATION COMPLETED');
    })
    .catch(error => {
      console.error('INITIALIZATION failed', error);
    });
}

export { GenerateSeedPhrase, AccountCreation, KeyringInitialization };