import type {
    AccountJson,
    AuthorizeRequest,
    MessageTypes,
    MessageTypesWithNoSubscriptions,
    MessageTypesWithNullRequest,
    MessageTypesWithSubscriptions,
    MetadataRequest,
    RequestTypes,
    ResponseSigningIsLocked,
    ResponseTypes,
    SeedLengths,
    SigningRequest,
    SubscriptionMessageTypes,
    ResponseJsonGetAccountInfo,
} from 'metadot-extension-base/background/types';
import type { Message } from 'metadot-extension-base/types';

import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import type { HexString } from '@polkadot/util/types';
import type { KeypairType } from '@polkadot/util-crypto/types';

import { PORT_EXTENSION } from 'metadot-extension-base/defaults';
import { getId } from 'metadot-extension-base/utils/getId';

import { chrome } from '@polkadot/extension-inject/chrome';
import { MetadataDef } from '@polkadot/extension-inject/types';

interface Handler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (data: any) => void;
    reject: (error: Error) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

// const port = chrome.runtime.connect({ name: PORT_EXTENSION });
const handlers: Handlers = {};

// setup a listener for messages, any incoming resolves the promise
// port.onMessage.addListener((data: Message['data']): void => {
//     const handler = handlers[data.id];

//     if (!handler) {
//         console.error(`Unknown response: ${JSON.stringify(data)}`);
//         return;
//     }

//     if (!handler.subscriber) {
//         delete handlers[data.id];
//     }

//     if (data.subscription) {
//         // eslint-disable-next-line @typescript-eslint/ban-types
//         (handler.subscriber as Function)(data.subscription);
//     } else if (data.error) {
//         handler.reject(new Error(data.error));
//     } else {
//         handler.resolve(data.response);
//     }
// });

function sendMessage<TMessageType extends MessageTypesWithNullRequest>(
    message: TMessageType
): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithNoSubscriptions>(
    message: TMessageType,
    request: RequestTypes[TMessageType]
): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithSubscriptions>(
    message: TMessageType,
    request: RequestTypes[TMessageType],
    subscriber: (data: SubscriptionMessageTypes[TMessageType]) => void
): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypes>(
    message: TMessageType,
    request?: RequestTypes[TMessageType],
    subscriber?: (data: unknown) => void
): Promise<ResponseTypes[TMessageType]> {
    console.log('send message', message, request);
    return new Promise((resolve, reject): void => {
        const id = getId();
        handlers[id] = { reject, resolve, subscriber };
        // port.postMessage({ id, message, request: request || {} });
    });
}

export async function editAccount(
    address: string,
    name: string
): Promise<boolean> {
    return sendMessage('pri(accounts.edit)', { address, name });
}

export async function showAccount(
    address: string,
    isShowing: boolean
): Promise<boolean> {
    return sendMessage('pri(accounts.show)', { address, isShowing });
}

export async function exportAccount(
    address: string,
    password: string
): Promise<{ exportedJson: KeyringPair$Json }> {
    return sendMessage('pri(accounts.export)', { address, password });
}

export async function exportAccounts(
    addresses: string[],
    password: string
): Promise<{ exportedJson: KeyringPairs$Json }> {
    return sendMessage('pri(accounts.batchExport)', { addresses, password });
}

export async function validateAccount(
    address: string,
    password: string
): Promise<boolean> {
    return sendMessage('pri(accounts.validate)', { address, password });
}

export async function forgetAccount(address: string): Promise<boolean> {
    return sendMessage('pri(accounts.forget)', { address });
}

export async function approveAuthRequest(id: string): Promise<boolean> {
    return sendMessage('pri(authorize.approve)', { id });
}

export async function approveMetaRequest(id: string): Promise<boolean> {
    return sendMessage('pri(metadata.approve)', { id });
}

export async function cancelSignRequest(id: string): Promise<boolean> {
    return sendMessage('pri(signing.cancel)', { id });
}

export async function isSignLocked(
    id: string
): Promise<ResponseSigningIsLocked> {
    return sendMessage('pri(signing.isLocked)', { id });
}

export async function approveSignPassword(
    id: string,
    savePass: boolean,
    password?: string
): Promise<boolean> {
    return sendMessage('pri(signing.approve.password)', {
        id,
        password,
        savePass,
    });
}

export async function approveSignSignature(
    id: string,
    signature: HexString
): Promise<boolean> {
    return sendMessage('pri(signing.approve.signature)', { id, signature });
}

export async function createAccountSuri(
    name: string,
    password: string,
    suri: string,
    type?: KeypairType,
    genesisHash?: string
): Promise<boolean> {
    return sendMessage('pri(accounts.create.suri)', {
        genesisHash,
        name,
        password,
        suri,
        type,
    });
}

export async function createSeed(
    length?: SeedLengths,
    type?: KeypairType
): Promise<{ address: string; seed: string }> {
    return sendMessage('pri(seed.create)', { length, type });
}

export async function getAllMetatdata(): Promise<MetadataDef[]> {
    return sendMessage('pri(metadata.list)');
}

export async function rejectAuthRequest(id: string): Promise<boolean> {
    return sendMessage('pri(authorize.reject)', { id });
}

export async function rejectMetaRequest(id: string): Promise<boolean> {
    return sendMessage('pri(metadata.reject)', { id });
}

export async function subscribeAccounts(
    cb: (accounts: AccountJson[]) => void
): Promise<boolean> {
    return sendMessage('pri(accounts.subscribe)', null, cb);
}

export async function subscribeAuthorizeRequests(
    cb: (accounts: AuthorizeRequest[]) => void
): Promise<boolean> {
    return sendMessage('pri(authorize.requests)', null, cb);
}

export async function subscribeMetadataRequests(
    cb: (accounts: MetadataRequest[]) => void
): Promise<boolean> {
    return sendMessage('pri(metadata.requests)', null, cb);
}

export async function subscribeSigningRequests(
    cb: (accounts: SigningRequest[]) => void
): Promise<boolean> {
    return sendMessage('pri(signing.requests)', null, cb);
}

export async function validateSeed(
    suri: string,
    type?: KeypairType
): Promise<{ address: string; suri: string }> {
    return sendMessage('pri(seed.validate)', { suri, type });
}

export async function jsonRestore(
    file: KeyringPair$Json,
    password: string
): Promise<void> {
    return sendMessage('pri(json.restore)', { file, password });
}