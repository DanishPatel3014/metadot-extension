// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { enable, handleResponse, redirectIfPhishing } from '@polkadot/extension-base/page';
import { injectExtension } from '@polkadot/extension-inject';

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }) => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== 'content') {
    return;
  }

  if (data.id) {
    handleResponse(data);
  } else {
    console.error('Missing id for response.');
  }
});

redirectIfPhishing().then((gotRedirected) => {
  if (!gotRedirected) {
    inject();
  }
}).catch((e) => {
  console.warn(`Unable to determine if the site is in the phishing list: ${(e).message}`);
  inject();
});

function inject() {
  injectExtension(enable, {
    name: 'metadot',
    version: '0.0.1',
  });
}
