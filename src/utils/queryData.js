/* eslint-disable */
import { encodeAddress } from '@polkadot/util-crypto';
import { useSelector } from 'react-redux';
import constants from '../../src/constants/onchain';



const {
  POLKADOT_CONFIG,
  KUSAMA_CONFIG,
  PHALA_CONFIG,
  KHALA_CONFIG,
  BIFROST_CONFIG,
  MOONRIVER_CONFIG,
  SHIDEN_CONFIG,
  KARURA_CONFIG,
  WESTEND_CONFIG,
  ROCOCO_CONFIG,
  DUSTY_CONFIG,
  ACALA_MANDALA_CONFIG,
  ASTAR_CONFIG,
  MOONBASE_CONFIG,
  ASGARD_CONFIG,
  SHIBUYA_CONFIG,
} = constants;


export const queryData = (network) =>{

    let query = '';
    let endPoint = '';
    switch (network) {
        case 'Polkadot Main Network':
            query = getQuery(POLKADOT_CONFIG.PREFIX);
            endPoint = POLKADOT_CONFIG.QUERY_ENDPOINT; 
            return {query, endPoint};            
    
        case 'Westend':
            query = getQuery(WESTEND_CONFIG.PREFIX);
            endPoint = WESTEND_CONFIG.QUERY_ENDPOINT; 
            return {query, endPoint};

        case 'Dusty':
            query = getQuery(DUSTY_CONFIG.PREFIX);
            endPoint = DUSTY_CONFIG.QUERY_ENDPOINT;    
            return {query, endPoint};

        case 'Shibuya':
            query = getQuery(SHIBUYA_CONFIG.PREFIX);
            endPoint = SHIBUYA_CONFIG.QUERY_ENDPOINT;    
            return {query, endPoint};

        default:
            query = getQuery(POLKADOT_CONFIG.PREFIX);
            endPoint = POLKADOT_CONFIG.QUERY_ENDPOINT; 
            return {query, endPoint};
    }
}


export const getQuery = (prefix) =>{

  const publicKey = useSelector((state) => state?.activeAccount?.publicKey);
  const address = encodeAddress(publicKey, prefix);

  console.log(address, 'address from get query')

   
  const ad1 = 'X653bBR12UrTxquuKCeqJMLtjbSiGNWCC3JHVsCksuZjSf3'
  

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
  }`
  return query;
}



