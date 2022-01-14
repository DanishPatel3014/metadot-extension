// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Runs in the extension background, handling all keyring access

import handlers from '@polkadot/extension-base/background/handlers';
import { PORT_CONTENT, PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { AccountsStore } from '@polkadot/extension-base/stores';
import chrome from '@polkadot/extension-inject/chrome';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// import { CryptoAndKeyringInit } from './utils/accounts';

// setup the notification (same a FF default background, white text)
// eslint-disable-next-line no-void
void chrome.browserAction.setBadgeBackgroundColor({ color: '#d90000' });
console.log('background script running');
// listen to all messages and handle appropriately
chrome.runtime.onConnect.addListener(async (port) => {
  try { // shouldn't happen, however... only listen to what we know about
    console.log('PORT_CONTENT PORT_EXTENSION ==>>', port);
    assert([PORT_CONTENT, PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`);

    // message and disconnect handlers
    port.onMessage.addListener((data) => handlers(data, port));
    port.onDisconnect.addListener(() => console.log(`Disconnected from ${port.name}`));
  } catch (error) {
    console.log('error in onConnect background ==>>', error);
  }
});

// initial setup
cryptoWaitReady()
  .then(() => {
    console.log('crypto initialized');

    // load all the keyring data
    keyring.loadAll({ store: new AccountsStore(), type: 'sr25519' });

    console.log('initialization completed');
  })
  .catch((error) => {
    console.error('initialization failed', error);
  });

// chrome.runtime.onInstalled.addListener(() => {
//   CryptoAndKeyringInit();
// });
