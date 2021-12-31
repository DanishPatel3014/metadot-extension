/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import { options as AcalaOptions } from '@acala-network/api';
import { formatBalance } from '@polkadot/util';
import { encodeAddress } from '@polkadot/keyring';
import constants from '../constants/onchain';

const { WsProvider, ApiPromise, Keyring } = require('@polkadot/api');
const BN = require('./bn');

const { ACALA_MANDALA_CONFIG } = constants;

const getSender = async (seed) => {
  const keyring = new Keyring({ type: 'sr25519' });
  const sender = await keyring.addFromUri(seed);
  return sender;
};

let balancesWithMultipleTokens = [];

// prettier-ignore
const providerInitialization = async (rpc) => {
  // eslint-disable-next-line no-underscore-dangle
  const _provider = new WsProvider(rpc);
  console.log('Provider', _provider);
  let apiR;
  if (rpc === ACALA_MANDALA_CONFIG.RPC_URL) {
    apiR = await ApiPromise.create(AcalaOptions({ provider: _provider }));
  } else {
    console.log('In else [][]');
    apiR = await ApiPromise.create({ provider: _provider });
    console.log('Apir', apiR);
  }
  return apiR;
};

const toUnit = (balance, decimals) => {
  console.log('To unit working 1', balance, decimals);
  const base = new BN(10).pow(new BN(decimals));
  console.log('To unit working 2', base);
  const dm = new BN(balance).divmod(base);
  console.log('To unit working 3');
  console.log('In to unit', parseFloat(`${dm.div.toString()}.${dm.mod.toString()}`));
  return parseFloat(`${dm.div.toString()}.${dm.mod.toString()}`);
};

const getBalance = async (api, account) => {
  const tokenLength = await api.registry.chainTokens.length;
  if (tokenLength > 1) {
    const balance = await setMultipleTokens(api, account);
    return balance;
  }
  const balance = await getBalanceWithSingleToken(api, account);
  return balance;
};

const getBalanceWithSingleToken = async (api, acc) => {
  const { data: balance } = await api.query.system.account(acc);
  console.log('In service balance', balance.free);

  const userBalance = formatBalance(balance.free, { decimals: api.registry.chainDecimals[0], forceUnit: '-', withUnit: false });
  console.log('Shehryaer --==++', userBalance, typeof abc, parseFloat(userBalance));
  return parseFloat(userBalance);
};

// Get balance of Native Token of a chain with multiple tokens
const getBalanceWithMultipleTokens = async (api, account) => {
  const tokenNames = await api.registry.chainTokens;
  const decimals = await api.registry.chainDecimals;
  const properties = await api.rpc.system.properties();
  console.log('Token names:', tokenNames);
  console.log('Decimals:', decimals);
  console.log('Properties', properties);
  // eslint-disable-next-line no-useless-catch
  try {
    const [now, { nonce, data: balances }] = await Promise.all([
      api.query.timestamp.now(),
      api.query.system.account(account),
    ]);

    const userBalance = formatBalance(balances.free, { decimals: api.registry.chainDecimals[0], forceUnit: '-', withUnit: false });
    return parseFloat(userBalance);
  } catch (err) {
    throw err;
  }
};

const formatNumber = (number, decimals) => {
  if (number.toString() === '0') return '0';
  return (Number(number.toString()) / 10 ** decimals).toFixed(5);
};

const wait = () => {
  setTimeout(() => {
    console.log('good');
  }, 10000);
};

const getBalanceOfAToken = async (api, account, token, decimals) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await api.query.tokens.accounts(account, { Token: token }, (result) => {
    // console.log('Result', result);
      const bal = formatNumber(result.free, decimals);
      // const bal = formatBalance(result.free, decimals, { forceUnit: '-', withUnit: false });
      console.log('Bal and token name', token, bal);
      balancesWithMultipleTokens = balancesWithMultipleTokens.concat({ name: token, balance: bal });
      console.log('In service balances mu tok', balancesWithMultipleTokens);
      // wait();
      return bal;
    });
  } catch (err) {
    throw err;
  }
};

const getBalances = () => {
  return balancesWithMultipleTokens;
};
// Get balance of Non Native Tokens of a chain with multiple tokens
// eslint-disable-next-line consistent-return
const setMultipleTokens = async (api, account, chainName) => {
  // balances = [];
  console.clear();
  try {
    console.log('Chain =====>>>', chainName);
    let allTokens = api.registry.chainTokens;
    console.log('All tokens', allTokens);
    const allDecimals = api.registry.chainDecimals;

    if (chainName === 'Karura') {
      allTokens = allTokens.splice(0, allTokens.length - 2);
      console.log('All tokens after splice', allTokens);
    }

    // // eslint-disable-next-line no-re``stricted-syntax
    // eslint-disable-next-line no-restricted-syntax
    // for (const singleToken of allTokens) {
    //   i += 1;
    //   console.log('iiiii', i);
    //   // eslint-disable-next-line no-await-in-loop
    //   const res2 = await getBalanceOfAToken(api, account, singleToken, 10);
    //   console.log('res2', res2);
    // }

    allTokens.map((singleToken, i) => {
      const res = getBalanceOfAToken(api, account, singleToken, allDecimals[i]);
      return res;
    });
    // allTokens.forEach(async (singleToken, i) => {
    //   const res = await getBalanceOfAToken(api, account, singleToken, allDecimals[i]);
    //   console.log('Res', res);
    // });
    // console.log('Done');
    // const res = await Promise.all(allTokens.map(async (singleToken, i) => {
    //   const res2 = await getBalanceOfAToken(api, account, singleToken, allDecimals[i]);
    //   console.log('Res 2', res2);
    // }));

    // });

    // return balancesRedux;
  } catch (err) {
    console.log('Err', err);
  }
};

const getTransactionFee = async (api, sender, recipient, decimalPlaces, amount) => {
  const amountSending = amount * 10 ** decimalPlaces;
  const info = await api.tx.balances
    // eslint-disable-next-line no-undef
    .transfer(sender, BigInt(amountSending))
    .paymentInfo(recipient);

  return info;
};

const addressMapper = (address, prefix) => {
  console.log(prefix, '||||||', address);
  const res = encodeAddress(address, prefix);
  console.log('Result ====>>', res);
  return res;
};

export {
  providerInitialization,
  getBalance,
  // getBalanceWithMultipleTokens,
  getSender,
  getTransactionFee,
  toUnit,
  addressMapper,
  getBalances,
};
