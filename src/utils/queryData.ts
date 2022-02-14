import { encodeAddress } from '@polkadot/util-crypto';
import constants from '../constants/onchain';
import { QueryObjectInterface } from './types';

const {
    POLKADOT_CONFIG,
    WESTEND_CONFIG,
    DUSTY_CONFIG,
    CONTEXTFREE_CONFIG,
    SHIBUYA_CONFIG,
} = constants;
const getQuery = (prefix: number, publicKey: string): string => {
    const address = encodeAddress(publicKey, prefix);
    console.log(address, 'address from get query');
    const query = `
      query {
    account(id: "${address}") {
        id
        transferTo {
          nodes {
            id
            token
            decimals
            extrinsicHash
            amount
            status
            toId
            fromId
            timestamp
          }
        }
        transferFrom {
          nodes {
            id
            token
            decimals
            extrinsicHash
            amount
            status
            toId
            fromId
            timestamp
          }
        }
    }
  }`;
    return query;
};
export const queryData = (
    network: string,
    publicKey: string
): QueryObjectInterface => {
    let query = '';
    let endPoint = '';
    switch (network) {
        case 'Polkadot Main Network':
            query = getQuery(POLKADOT_CONFIG.PREFIX, publicKey);
            endPoint = POLKADOT_CONFIG.QUERY_ENDPOINT;
            return { query, endPoint };
        case 'Westend':
            query = getQuery(WESTEND_CONFIG.PREFIX, publicKey);
            endPoint = WESTEND_CONFIG.QUERY_ENDPOINT;
            return { query, endPoint };
        case 'Dusty':
            query = getQuery(DUSTY_CONFIG.PREFIX, publicKey);
            endPoint = DUSTY_CONFIG.QUERY_ENDPOINT;
            return { query, endPoint };
        case 'Shibuya':
            query = getQuery(SHIBUYA_CONFIG.PREFIX, publicKey);
            endPoint = SHIBUYA_CONFIG.QUERY_ENDPOINT;
            return { query, endPoint };
        case 'ContextFree':
            query = getQuery(CONTEXTFREE_CONFIG.PREFIX, publicKey);
            endPoint = CONTEXTFREE_CONFIG.QUERY_ENDPOINT;
            return { query, endPoint };
        default:
            query = getQuery(POLKADOT_CONFIG.PREFIX, publicKey);
            endPoint = POLKADOT_CONFIG.QUERY_ENDPOINT;
            return { query, endPoint };
    }
};
