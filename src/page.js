import { enable, handleResponse, redirectIfPhishing } from 'metadot-extension-base/page';
import { injectExtension } from '@polkadot/extension-inject';

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
  console.log('got redirected');
  if (!gotRedirected) {
    console.log('got redirected in');
    inject();
  }
}).catch((e) => {
  console.log(`Unable to determine if the site is in the phishing list: ${(e).message}`);
  inject();
});

function inject() {
  injectExtension(enable, {
    name: 'Metadot',
    version: '0.0.3',
  });
}
