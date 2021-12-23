// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PORT_CONTENT } from '@polkadot/extension-base/defaults';
import chrome from '@polkadot/extension-inject/chrome';

// connect to the extension
const port = chrome.runtime.connect({ name: PORT_CONTENT });

// send any messages from the extension back to the page
port.onMessage.addListener((data) => {
  window.postMessage({ ...data, origin: 'content' }, '*');
});

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }) => {
  // only allow messages from our window, by the inject

  if (source !== window || data.origin !== 'page') {
    return;
  }

  port.postMessage(data);
});

// inject our data injector
const script = document.createElement('script');

script.src = chrome.extension.getURL('page.js');

script.onload = () => {
  // remove the injecting tag when loaded
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
};

(document.head || document.documentElement).appendChild(script);
