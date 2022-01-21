// Copyright 2019-2021 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import chrome from '@polkadot/extension-inject/chrome';

let Port = {};
let handlers = {};

initPort();

export async function initPort() {
  if (Port.disconnect) {
    Port.disconnect();
  }
  handlers = {};
  Port = chrome.runtime.connect({ name: PORT_EXTENSION });
  await addListener();
}

async function addListener() {
  Port.onMessage.addListener((data) => {
    const handler = handlers[data.id];
    if (!handler) {
      console.error(`Unknown response: ${JSON.stringify(data)}`);
      return;
    }
    if (!handler.subscriber) {
      delete handlers[data.id];
    }
    if (data.subscription) {
      (handler.subscriber)(data.subscription);
    } else if (data.error) {
      handler.reject(new Error(data.error));
    } else {
      handler.resolve(data.response);
    }
  });
}

function sendMessage(message, request, subscriber) {
  console.log('message ==>>', message);
  return new Promise((resolve, reject) => {
    const id = Date.now();
    handlers[id] = { reject, resolve, subscriber };
    Port.postMessage({ id, message, request: request || {} });
  });
}

export async function subscribeAccounts(cb) {
  return sendMessage('pri(accounts.subscribe)', null, cb);
}

export async function subscribeAuthorizeRequests(cb) {
  return sendMessage('pri(authorize.requests)', null, cb);
}

export async function subscribeMetadataRequests(cb) {
  return sendMessage('pri(metadata.requests)', null, cb);
}

export async function subscribeSigningRequests(cb) {
  return sendMessage('pri(signing.requests)', null, cb);
}

export async function approveAuthRequest(id) {
  return sendMessage('pri(authorize.approve)', { id });
}

export async function createAccountSuri(name, password, suri,
  type = undefined, genesisHash = undefined) {
  return sendMessage('pri(accounts.create.suri)', {
    genesisHash, name, password, suri, type,
  });
}

export async function exportAccount(address, password) {
  return sendMessage('pri(accounts.export)', { address, password });
}

export async function getAuthorizePair(address, password) {
  return sendMessage('pri(accounts.getAuthorizePair)', { address, password });
}

export async function executeTransaction(address, password, tp1, tp2) {
  return sendMessage('pri(accounts.executeTransaction)', {
    address, password, tp1, tp2,
  });
}
