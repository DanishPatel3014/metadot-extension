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
import { ApiPromise, WsProvider } from '@polkadot/api';

// setup the notification (same a FF default background, white text)
// eslint-disable-next-line no-void
void chrome.browserAction.setBadgeBackgroundColor({ color: '#d90000' });

chrome.runtime.onConnect.addListener(async (port) => {
  try {
    assert([PORT_CONTENT, PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`);

    if (port.name === PORT_EXTENSION && localStorage.getItem('rpcUrl')) {
      // adding temporary handler
      // eslint-disable-next-line no-inner-declarations
      function tempHandler(data) { handlers(data, port); }
      port.onMessage.addListener(tempHandler);

      // creating API
      const wsProvider = new WsProvider(localStorage.getItem('rpcUrl'));
      const handlerAPI = await ApiPromise.create({ provider: wsProvider });

      // removing temporary Handler
      port.onMessage.removeListener(tempHandler);

      // adding api handler
      port.onMessage.addListener((data) => handlers(data, port, handlerAPI));
    } else {
      port.onMessage.addListener((data) => handlers(data, port));
    }

    port.onDisconnect.addListener(() => console.log(`Disconnected from ${port.name}`));
  } catch (error) {
    console.log('error in onConnect background ==>>', error);
  }
});

chrome.runtime.onRestartRequired.addListener((data) => {
  console.log('PORT_CONTENT PORT_EXTENSION ==>>', data);
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
