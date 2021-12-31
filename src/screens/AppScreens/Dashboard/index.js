/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';
// eslint-disable-next-line import/namespace
import {
  CircularProgress,
} from '@mui/material';
import {
  cryptoWaitReady, ethereumEncode, addressToEvm, evmToAddress,
  blake2AsHex, decodeAddress,
} from '@polkadot/util-crypto';
import { FixedPointNumber } from '@acala-network/sdk-core';
import type { MetadataDefBase } from '@polkadot/extension-inject/types';
import { selectableNetworks } from '@polkadot/networks';
import { ethers } from 'ethers';

// Drop Down Icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import {
  formatBalance, BN_HUNDRED, hexToU8a,
  u8aToHex,
} from '@polkadot/util';

import { useHistory } from 'react-router-dom';
import ApiCalls from '../../../utils/api';

import MainCard from './MainCard';
import AssetsAndTransactions from './AssetsAndTransactions';

import { setApiInitializationStarts } from '../../../redux/slices/api';
import {
  setRpcUrl, setBalance, setChainName, setLoggedIn, resetAccountSlice,
  setBalances, setPublicKey,
} from '../../../redux/slices/account';
import { fonts, colors } from '../../../utils';
import { decrypt } from '../../../utils/accounts';
import {
  addressMapper,
  providerInitialization, getBalance, toUnit,
  getBalances,
} from '../../../utils/services';
import {
  AccountContainer,
  AccountSetting,
  AccountText,
  DashboardHeader,
  LogoContainer,
  NetworkContainer,
  SelectChain,
  SelectedChain,
  Wrapper,
} from './StyledComponents';
import Logo from '../../../assets/images/topLogo.svg';
import { SelectNetwork, TxDetails } from '../../../components';
import {
  HorizontalContentDiv,
  NextIcon,
  OptionRow,
  OptionText,
} from '../../../components/Modals/SelectNetwork/StyledComponents';

import {
  setAuthScreenModal,
  setLoadingFor,
} from '../../../redux/slices/successModalHandling';
import BN from '../../../utils/bn';

import networks from './networkModalData';
import DropDown from './DropDown';

import AuthScreen from '../../../components/Modals/AuthScreen/AuthScreen';

const bs58 = require('bs58');

const { blake2b } = require('blakejs');
const { WsProvider, ApiPromise, Keyring } = require('@polkadot/api');

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;
const { primaryTextColor } = colors;

const {
  availableNetworks,
  KusamaMainNetworks,
  TestNetworks,
  BetaNetworks,
} = networks;

const useStyles = makeStyles((theme) => ({
  customWidth: {
    '& div': {
      // this is just an example, you can use vw, etc.
      background: 'transparent',
      // border: '1px solid green',
    },
  },
}));

function Dashboard(props) {
  const classes = useStyles(props);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);
  const [txDetailsModalData, setTxDetailsModalData] = useState('');
  const [isTxDetailsModalOpen, setIsTxDetailsModalOpen] = useState(false);
  const [balanceDetails, setBalanceDetails] = useState([]);
  const currentUser = useSelector((state) => state);
  const { apiInitializationStarts } = useSelector((state) => state.api);
  const {
    publicKey, chainName, balance, tokenName, seed, balanceInUsd, accountName, walletName,
    api,
  } = currentUser.account;
  async function main() {
    const { api } = currentUser.api;

    // Retrieve the initial balance. Since the call has no callback, it is simply a promise
    // that resolves to the current on-chain value
    let {
      data: { free: previousFree },
      nonce: previousNonce,
    } = await api.query.system.account(publicKey);
    const decimalPlaces = await api.registry.chainDecimals;
    // Here we subscribe to any balance changes and update the on-screen value
    api.query.system.account(
      publicKey,
      // eslint-disable-next-line consistent-return
      ({ data: { free: currentFree }, nonce: currentNonce }) => {
        // Calculate the delta
        const change = currentFree.sub(previousFree);

        // Only display positive value changes (Since we are pulling `previous` above already,
        // the initial balance change will also be zero)
        if (!change.isZero()) {
          console.log('Balance changed [][]');
          const bal = getBalance(api, publicKey)
            .then((res) => {
              dispatch(setBalance(res));
            })
            .catch((err) => console.log('Err', err));
          // const newBalance = chainName === 'AcalaMandala' ? change / 10 ** decimalPlaces[0] : change / 10 ** decimalPlaces;
          // dispatch(setBalance(newBalance + balance));

          previousFree = currentFree;
          previousNonce = currentNonce;
          return bal;
        }
      },
    );
  }

  main().catch(console.error);

  const [apiTokenName, setApiTokenName] = useState('polkadot');
  const getTokenApi = `https://api.coingecko.com/api/v3/simple/price?ids=${apiTokenName}&vs_currencies=usd`;
  const getTokenPrice = new ApiCalls();

  useEffect(() => {
    getTokenPrice.GetRequest(getTokenApi);
  }, [getTokenApi]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --------State and funtions for SlectNetwork Modal
  const handleSelectionOnKusamaMainNetwork = (data) => {
    if (!data.disabled) {
      selectAndGoBack(data.name);
    }
  };

  const decryptSeed = async () => {
    // console.log(currentUser.account.seed);
    const res = await decrypt(currentUser.account.seed, 'helloworldA1#');
    console.log(res);
  };

  const getbalanceKarura = async () => {
    console.log('Working here [][]');
    const provider = new WsProvider('wss://karura-rpc-0.aca-api.network');
    const apiK = await ApiPromise.create({ provider });
    console.log('Api initialized');
    // const bal2 = await getBalance(apiK, currentUser.account.publicKey);
    // console.log('Single token', bal2);
    const bal = await getBalance(apiK, currentUser.account.publicKey);
    console.log('Multiple tokens', bal);
  };

  const getExistentialDeposit = async () => {
    const data = await currentUser.api.api.consts.balances.existentialDeposit;
    console.log('Data', data);

    // const base = new BN(10).pow(new BN(10));
    // console.log('To unit working 2', base);
    // const dm = new BN(data.words[1]).divmod(base);
    // console.log('In to unit', `${dm.div.toString()}.${dm.mod.toString()}`);
    const decimalPlaces = await currentUser.api.api.registry.chainDecimals[0];
    console.log('Decimals', decimalPlaces);
    // const res = await toUnit(data.words[1], decimalPlaces);

    /// /////////////////////////////////////////////////////////////////
    /// ////// This is for the existential deposit stuff ////////////////
    /// /////////////////////////////////////////////////////////////////

    // This is for Westend
    // const existentialDeposit = 10 * 10 ** -3;

    // This is for Polkadot
    const existentialDeposit = 1;

    // This is for Kusama
    // const existentialDeposit = 0.000033333333;

    // This is for Karura
    // const existentialDeposit = 0.1;

    // This is for Rococo
    // const existentialDeposit = 10 * 10 ** -3;

    // This is for Dusty
    // const existentialDeposit = 1 * 10 ** -3;

    const balance = existentialDeposit * 10 ** decimalPlaces;

    console.log('Balance', balance);
    console.log('Existential deposit', currentUser.api.api.consts.balances.existentialDeposit);
    // eslint-disable-next-line eqeqeq
    if (balance == currentUser.api.api.consts.balances.existentialDeposit) {
      console.log('Balance is equal to existenial deposit');
    } else if (balance > currentUser.api.api.consts.balances.existentialDeposit) {
      console.log('Balance is greater');
    } else if (balance < currentUser.api.api.consts.balances.existentialDeposit) {
      console.log('Balance is less');
    }
    // console.log('Existential deposit', dot.gt(currentUser.api.api.consts.balances.existentialDeposit));
    // console.log('Res', res);
  };

  const doTransaction = async () => {
    const keyring = new Keyring({ type: 'sr25519' });

    const res = await decrypt(currentUser.account.seed, 'helloworldA1');
    const sender = keyring.addFromUri(res);

    const hash = await currentUser.api.api.tx.balances
      .transfer(
        '5GjSQRFYEFBY1nmVuGHTyKkRHrodQmUKdA7kWzfmfLp262xG',
        1,
      )
      .signAndSend(
        sender,
      ).then((res) => console.log('Res', res.toHex()))
      .catch((err) => {
        console.error('Error [][][]', err);
      });

    console.log('Hash ===>>>', hash);
  };

  const sendTransaction = async () => {
    console.log('Working');
    try {
      console.log('a');
      console.log('b');
      console.log('c');
      const keyring = new Keyring({ type: 'sr25519' });
      const res = await decrypt(currentUser.account.seed, 'helloworldA1');
      console.log('res []][]', res);
      console.log('Currencies here [][]', currentUser.api.api.tx.currencies);
      const sender = keyring.addFromUri(res);
      const hash = await currentUser.api.api.tx.currencies
        .transfer(
          '5Dz1i42ygyhi4BxPnvKtRY4TBShTMC9T2FvaMB8CWxoU3QgG',
          {
            Token: 'KSM',
          },
          '10000000000',
        )
        .signAndSend(sender, async ({ status, events }) => {
          if (status.isInBlock) {
            console.log('Status', status.isInBlock, status.isFinalized);
            console.log('EVents', events);
            const hash = status.asInBlock.toString();
            console.log('Hash before tx ', hash);
          }
        });
      console.log('Hash after tx', hash);
      // // const decimals = currentUser.account.chainName === 'AcalaMandala'
      // //   ? decimalPlaces[0] : decimalPlaces;
      // // api.tx.balancs.transferAll
      // const result = await currentUser.api.api.tx.balances
      //   .transfer(
      //     '5Dz1i42ygyhi4BxPnvKtRY4TBShTMC9T2FvaMB8CWxoU3QgG', {
      //       Token: 'AUSD',
      //     }, 1 * 10 ** 11,
      //   )
      //   .signAndSend(
      //     sender, async ({ status, events }) => {
      //       console.log('Status', status.isInBlock, status.isFinalized);
      //       console.log('EVents', events);
      //       const hash = status.asInBlock.toString();
      //       console.log('Hash', hash);
      //       // }
      //     },
      //   ).catch((err) => {
      //     alert('Transaction failed');
      //     console.error('Error [][][]', err);
      //   });
    } catch (err) {
      alert('An error occurred');
      console.log('Error', err);
    }
  };

  const formatNumber = (number, decimals) => {
    if (number.toString() === '0') return '0';
    return (Number(number.toString()) / 10 ** decimals).toFixed(5);
  };

  const nonNativeTokenED = () => {
    const MAX = new FixedPointNumber(0.01, 10);
    // const MAX = FixedPointNumber.fromInner('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    console.log('MAX', MAX);
    // eslint-disable-next-line eqeqeq
    console.log('BOOl [][]', new FixedPointNumber(0.1, 13) == currentUser.api.api.consts.balances.existentialDeposit);
  };

  const fetchBalance = async () => {
    const allTokens = currentUser.api.api.registry.chainTokens;
    const allDecimals = currentUser.api.api.registry.chainDecimals;
    console.log('All decimals', allDecimals);
    // eslint-disable-next-line array-callback-return
    const data = allTokens.map((singleToken, i) => {
      const tokenData2 = currentUser.api.api.query.tokens.accounts(publicKey, { Token: singleToken }, (result) => {
        console.log('All decimals', allDecimals[i]);
        const bal = formatNumber(result.free, allDecimals[i]);
        console.log(singleToken, bal, allDecimals[i]);
        const values = { tokenName: singleToken, balance: bal, decimals: allDecimals[i] };
        console.log('Balance details', balanceDetails);
        setBalanceDetails((prevState) => ([
          ...prevState,
          ...values,
        ]));
        // setBalanceDetails({ ...balanceDetails, values });
        return bal;
      });
    });
  };

  const balances = [];
  const setMultipleTokens = async () => {
    try {
      console.log('Chain =====>>>', currentUser.account.chainName);
      const allTokens = currentUser.api.api.registry.chainTokens;
      console.log('All tokens', allTokens);
      // const allDecimals = currentUser.api.api.registry.chainDecimals;
      // if (currentUser.account.chainName == 'Karura') {
      //   allTokens = allTokens.splice(0, allTokens.length - 2);
      //   console.log('All tokens after splice', allTokens);
      // }
      // allTokens.map(async (singleToken, i) => {
      //   const tokenData2 = currentUser.api.api.query.tokens.accounts(publicKey, { Token: singleToken }, (result) => {
      //     const bal = formatNumber(result.free, allDecimals[i]);
      //     // const bal = 10;
      //     console.log('Token and balance', singleToken, bal);
      //     console.log('Balance details', balanceDetails);
      //     const values = { tokenName: singleToken, balance: bal, decimals: allDecimals[i] };
      //     // setBalanceDetails((prevState) => ([
      //     //   ...prevState,
      //     //   values,
      //     // ]));
      //     balances.push({
      //       tokenName: singleToken, balance: bal, decimals: allDecimals[i], isNative: false,
      //     });
      //     console.log('Balances arr', balances);
      //     setBalanceDetails((balanceDetails) => [...balanceDetails,
      //       {
      //         tokenName: singleToken, balance: bal, decimals: allDecimals[i], isNative: false,
      //       }]);
      //   });
      // });
    } catch (err) {
      console.log('Err', err);
    }
  };

  const getMultipleTokens = () => {
    console.log('Redux before', currentUser);
    dispatch(setBalances(balanceDetails));
    console.log('Redux after', currentUser);
  };

  const getMultipleTokensBalance = async () => {
    const address = '5Dz1i42ygyhi4BxPnvKtRY4TBShTMC9T2FvaMB8CWxoU3QgG';
    const Token = 'LKSM';

    const { data: balance } = await currentUser.api.api.query.system.account(address);
    console.log('In service balance', balance.reserved);

    const userBalanceSingleToken = formatBalance(balance.free, { decimals: 12, forceUnit: '-', withUnit: false });
    console.log('Shehryaer --==++', userBalanceSingleToken, typeof abc, parseFloat(userBalanceSingleToken));

    const tokenData = await currentUser.api.api.query.tokens.accounts(address, {
      Token,
    });
    console.log('Hello world', tokenData.toHuman());

    const allTokens = await currentUser.api.api.registry.chainTokens;
    console.log('All tokens', await currentUser.api.api.registry.chainTokens);
    console.log('All decimals of tokens', currentUser.api.api.registry.chainDecimals);
    const res = await currentUser.api.api.query.tokens.accounts(address,
      { Token }, (res) => {
        console.log('balance in res', res);
        const bal = formatNumber(res.free, 12);
        // const bal = formatBalance(res.free, 12);
        console.log('BAL here', bal);
      });
    console.log('Result [][]', res);
    const userBalance = formatBalance(res.free, { decimals: 12, forceUnit: '-', withUnit: false });
    console.log('Free balance --==++', userBalance, parseFloat(userBalance));
    const userBalance2 = formatBalance(res.frozen, { decimals: 12, forceUnit: '-', withUnit: false });
    console.log('Frozen balance --==++', userBalance2, parseFloat(userBalance2));

    const allDecimals = currentUser.api.api.registry.chainDecimals;
    console.log('All decimals', allDecimals);
    allTokens.map(async (singleToken, i) => {
      const tokenData2 = await currentUser.api.api.query.tokens.accounts(address, { Token: singleToken }, (result) => {
        console.log('All decimals', allDecimals[i]);
        const bal = formatNumber(result.free, allDecimals[i]);
        console.log(singleToken, bal);
      });
    });
  };

  const getTxFee = async () => {
    console.log('Tx fee running', balance, publicKey);
    const info = await currentUser.api.api.tx.balances
      .transfer(publicKey, balance)
      .paymentInfo(publicKey);

    const adjFee = info.partialFee.muln(110).div(BN_HUNDRED);
    const maxTransfer = balance - adjFee;

    console.log('Adj fee', adjFee);

    console.log('Tx fee', info.partialFee.toHuman());
    console.log('Max Transfer', maxTransfer);
  };

  // --------State and funtions for SlectNetwork Modal
  // this function is currently not in use becuase other kusama main networks are disabled
  const RenderContentForKusamaMainNetwork = (data, handleClick) => {
    const { name, icon, disabled } = data;
    const optionRow = {
      className: disabled ? 'tooltip' : 'abc',
      key: name,
      onClick: () => {
        handleClick(data);
      },
      disabled,
    };
    return (
      <OptionRow {...optionRow}>
        {disabled && <span className="tooltiptext">Coming Soon!</span>}
        <HorizontalContentDiv>
          <img src={icon} alt="icon" />
          <OptionText className={mainHeadingfontFamilyClass}>{`${name}`}</OptionText>
        </HorizontalContentDiv>
      </OptionRow>
    );
  };

  const RenderContentForAvailableNetwroks = (data, handleClick) => {
    const {
      name, theme, moreOptions, disabled,
    } = data;
    return (
      <OptionRow
        className={disabled && 'tooltip'}
        key={name}
        onClick={async () => {
          setIsLoading(true);
          await handleClick(data);
        }}
        disabled={disabled}
      >
        {disabled && <span className="tooltiptext">Coming Soon!</span>}
        <HorizontalContentDiv>
          <img src={theme} alt="token" />
          <OptionText className={mainHeadingfontFamilyClass}>{name}</OptionText>
          {isLoading && (
            <CircularProgress
              style={{
                color: primaryTextColor,
                width: 20,
                height: 25,
                paddingRight: 20,
              }}
            />
          )}
        </HorizontalContentDiv>
        {moreOptions && (
          <NextIcon>
            <KeyboardArrowRightIcon />
          </NextIcon>
        )}
      </OptionRow>
    );
  };

  const [modalState, setModalState] = useState({
    firstStep: true,
    renderMethod: RenderContentForAvailableNetwroks,
    currentData: availableNetworks,
  });

  const selectAndGoBack = () => {
    resetState();
    setIsModalOpen(false);
  };

  const resetState = () => {
    setModalState({
      firstStep: true,
      renderMethod: RenderContentForAvailableNetwroks,
      currentData: availableNetworks,
    });
  };

  // prettier-ignore
  const handleSelection = async (data) => {
    console.log('In handle selection', data);
    setIsLoading(true);
    if (data.disabled) {
      setIsLoading(false);
      return;
    } if (data.name === 'Test Networks') {
      setModalState({
        firstStep: false,
        renderMethod: RenderContentForAvailableNetwroks,
        currentData: TestNetworks,
      });
      setIsLoading(false);
    } else if (data.name === 'Kusama Main Networks') { // this condition is not in use at the moment
      setIsLoading(false);
      setModalState({
        firstStep: false,
        renderMethod: RenderContentForKusamaMainNetwork,
        currentData: KusamaMainNetworks,
      });
    } else if (data.name === 'Beta Networks') {
      setIsLoading(false);
      setModalState({
        firstStep: false,
        renderMethod: RenderContentForKusamaMainNetwork,
        currentData: BetaNetworks,
      });
    } else {
      const publicKeyOfRespectiveChain = addressMapper(currentUser.account.publicKey, data.prefix);
      dispatch(setApiInitializationStarts(true));
      dispatch(setLoadingFor('Api Initialization...'));
      dispatch(setRpcUrl({ rpcUrl: data.rpcUrl }));
      dispatch(setChainName({ chainName: data.name }));
      dispatch(setPublicKey(publicKeyOfRespectiveChain));

      // const bal = await getBalance(currentUser.api.api, publicKeyOfRespectiveChain);
      // dispatch(setBalances(bal));

      setIsLoading(false);

      selectAndGoBack(data.name);
    }
  };

  // --------XXXXXXXXXXXXXXX-----------

  // Drop Down
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getBloackDetails = async () => {
    const sender = '5Dz1i42ygyhi4BxPnvKtRY4TBShTMC9T2FvaMB8CWxoU3QgG';
    console.log('Working');
    // const block = await currentUser.api.api.rpc.chain.getBlock('0xded7e4ae1d2011f1628ee9d7e34d417cdc64c77c13e02d2ae7549d6903d7c6fd');
    // block.block.extrinsics.map((ex) => console.log(ex.hash));

    const signedBlock = await currentUser.api.api.rpc.chain.getBlock('0x709e5eceac473c17c2c3a0447abf1f88119fecaedf46a983bd2742ac1549f9ce');

    // the information for each of the contained extrinsics
    signedBlock.block.extrinsics.forEach((ex, index) => {
      console.log('Tx hash here', ex.hash.toHuman());
      // the extrinsics are decoded by the API, human-like view
      console.log(index, ex.toHuman());

      const { isSigned, meta, method: { args, method, section } } = ex;

      // explicit display of name, args & documentation
      console.log(`${section}.${method}(${args.map((a) => a.toString()).join(', ')})`);
      // console.log(meta.documentation.map((d) => d.toString()).join('\n'));

      // signer/nonce info
      if (isSigned) {
        // eslint-disable-next-line eqeqeq
        if (ex.signer == sender) {
          console.log('The tx hash', ex.hash.toHuman());
          alert('Signer matched', ex.hash.toHuman());
        }
        console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
      }
    });
  };

  const deposit = async () => {
    try {
      console.log('Hello');
      console.log(currentUser.api.api.xtokens);
      await currentUser.api.api.tx.currencies.deposit();
    } catch (err) {
      console.log('Error ', err);
    }
  };
  // eslint-disable-next-line consistent-return
  const params = async () => {
    try {
      console.log('Working');
      const provider = new WsProvider('wss://kusama-rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });
      console.log('Api initialized');
      const keyring = new Keyring({ type: 'sr25519' });
      const res = await decrypt(currentUser.account.seed, 'helloworldA1#');
      console.log('res []][]', res);
      console.log('Currencies here [][]', currentUser.api.api.tx.currencies);
      const sender = keyring.addFromUri(res);
      // From Polkadot runtime 9110 (no destination weight)
      // Get first item, it should have V0, V1, ...
      // const firstType = api.createType(call.meta.args[0].type.toString());
      // const isCurrent = firstType.defKeys.includes('V1');

      const amount = 0.001 * 10 ** 12;

      const isParaTeleport = false;
      const dst = [{ X1: { ParaChain: 2001 } },

        { X1: { AccountId32: { id: api.createType('AccountId32', 'deGQLYTrWDYS5PhBkf2q6V9uyYsNbUiEPyrCZyMrBPuubGG').toHex(), network: 'Any' } } },
        [{ ConcreteFungible: { amount } }],
        3000,
      ];
      const acc = { X1: { AccountId32: { id: api.createType('AccountId32', 'deGQLYTrWDYS5PhBkf2q6V9uyYsNbUiEPyrCZyMrBPuubGG').toHex(), network: 'Any' } } };
      const ass = isParaTeleport
        ? [{ ConcreteFungible: { amount, id: { X1: 'Parent' } } }]
        : [{ ConcreteFungible: { amount } }];

      return [{ V0: true }, { V0: dst }, { V0: 10 }, 0, false];

      // const transferHandle = await currentUser.api.api.tx.xcmPallet.reserveTransferAssets(...dst);
      // console.log('Transfer handle', transferHandle);
      // const info = await currentUser.api.api.tx.xcmPallet.reserveTransferAssets(...dst).paymentInfo(sender);
      // console.log('The end');
    } catch (err) {
      console.log('Error', err);
    }

    // return isCurrent
    //   ? call.meta.args.length === 5
    //     // with weight
    //     ? call.method === 'limitedTeleportAssets'
    //       ? [{ V0: dst }, { V0: acc }, { V0: ass }, 0, { Unlimited: null }]
    //       : [{ V0: dst }, { V0: acc }, { V0: ass }, 0, destWeight]
    //     // without weight
    //     : [{ V0: dst }, { V0: acc }, { V0: ass }, 0]
    //   : [dst, acc, ass, destWeight];
    // [api, amount, call, destWeight, isParaTeleport, recipientId, recipientParaId]
  };

  const XCMP2 = async () => {
    console.clear();
    try {
      const x = currentUser.api.api.query.parachainInfo;
      console.log('Parachin ID ===>>>', x);
      const amount = 0.001;
      const keyring = new Keyring({ type: 'sr25519' });
      const res = await decrypt(currentUser.account.seed, 'helloworldA1#');
      console.log('res []][]', res);
      console.log('Currencies here [][]', currentUser.api.api.tx.currencies);
      const sender = keyring.addFromUri(res);
      console.log('Hello');
      console.log(currentUser.api.api.tx.xcmPallet);
      const theAmount = amount * 10 ** 12;
      console.log('The amount', theAmount);
      // const theAmount = new BN(amount).multipliedBy(new BN(1000000000000)).toFixed();
      const paras = [
        {
          // X1: { Parachain: 2000 },
          X1: { Parachain: 2001 },
        },
        {
          X1: {
            AccountId32: {
              network: {
                Any: null,
              },
              id: sender,
            },
          },
        },
        [
          {
            ConcreteFungible: {
              id: {
                Null: null,
              },
              amount: theAmount,
            },
          },
        ],
        3000000,
      ];
      console.log('Params set');
      const transferHandle = await currentUser.api.api.tx.xcmPallet.reserveTransferAssets(...paras);
      console.log('Transfer handle', transferHandle);
      const info = await currentUser.api.api.tx.xcmPallet.reserveTransferAssets(...paras).paymentInfo(sender);
    } catch (err) {
      console.log('Error', err);
    }
  };

  const getEthAddressFromEthersLib = () => {
    const res = ethers.Wallet.fromMnemonic('area opera visual cactus oak trip guitar farm scare trophy pool model');
    console.log('MetaMask and polkadot js MoonBeam', res);
  };

  const convertIntoH160Address = (address) => {
    // const rawAddress = hexToU8a(ss58_decode(address));
    // console.log('raw address', rawAddress);
    // const ethAddress = ethereumEncode(rawAddress);
    // console.log('Eth address || H160', ethAddress);
    const evmAddress = u8aToHex(
      addressToEvm(address, false),
    );

    const subAddress = evmToAddress(evmAddress, 5);
    console.log('Acala, Subscan and shibuyas address on hoonkime ===>>>', evmAddress);
    console.group('Sub address ====>>>', subAddress);
  };

  function ss58_decode(address) {
    // const bytes = new Uint8Array([42, ...address]);
    // const hash = blake2b(bytes);
    // const complete = new Uint8Array([...bytes, hash[0], hash[1]]);
    // console.log('Bye', bs58.encode(complete));
    // return bs58.encode(complete);
    console.log(`Parity ||| 0x${blake2AsHex(decodeAddress(address), 256).substring(26)}`);
    //  return `0x${crypto.blake2AsHex(crypto.decodeAddress(address), 256).substring(26)}`;
  }

  const multipleAddresses = () => {
    console.log('BS 58 [][]', bs58.decode(publicKey));
    // eslint-disable-next-line eqeqeq
    // if (publicKey.length != 32) {
    //   return null;
    // }
    const bytes = new Uint8Array([42, ...publicKey]);
    const hash = blake2b(bytes);
    console.log('Hash', hash);
    const complete = new Uint8Array([...bytes, hash[0], hash[1]]);
    console.log('complete', bs58.encode(complete));
    // console.log('Hello ===>>', ss58Format);
    const RELAY_CHAIN = 'Relay Chain';
    const hashes: MetadataDefBase[] = selectableNetworks
      .filter(({ genesisHash }) => !!genesisHash.length)
      .map((network) => ({
        chain: network.displayName,
        genesisHash: network.genesisHash[0],
        icon: network.icon,
        ss58Format: network.prefix,
      }));
    console.log('Hashes', hashes);
    return hashes;
  };

  // --------XXXXXXXXXXXXXXX-----------

  return (
    <Wrapper pb>
      <DashboardHeader>
        <LogoContainer onClick={() => dispatch(setAuthScreenModal(true))}>
          <img src={Logo} width="30px" height="34px" alt="Metadot Logo" />
        </LogoContainer>

        <NetworkContainer>
          <SelectChain
            onClick={() => (apiInitializationStarts ? console.log('abc') : setIsModalOpen(true))}
            disabled={!!apiInitializationStarts}
          >
            <SelectedChain className={subHeadingfontFamilyClass}>
              {chainName.includes('Network')
                ? chainName
                : `${chainName} Network`}

            </SelectedChain>
            <ArrowDropDownIcon id="arrow-drop-down-icon" style={{ fontSize: '1.7rem' }} />
          </SelectChain>
        </NetworkContainer>

        <AccountContainer id="account-container" onClick={handleClick}>
          <AccountSetting id="account-setting">
            <AccountText id="account-text" className={mainHeadingfontFamilyClass}>
              {accountName.slice(0, 1)}
            </AccountText>
          </AccountSetting>
        </AccountContainer>

        {/* Menu Start */}
        <DropDown
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          classes={classes}
        />
        {/* Menu End */}

      </DashboardHeader>

      <MainCard
        balance={balance}
        chainName={chainName}
        tokenName={tokenName}
        address={publicKey}
        walletName={walletName}
        balanceInUsd={balanceInUsd || 0}
        accountName={accountName}
      />

      <AssetsAndTransactions
        handleOpenTxDetailsModal={() => setIsTxDetailsModalOpen(true)}
        setTxDetailsModalData={setTxDetailsModalData}
        transactionData={transactions}
        balances={currentUser.account.balances}
      />

      {/* <button
        onClick={() => setAuthScreenModal(true)}
        handleClose={() => setAuthScreenModal(false)}
      >
        Authorization Modal

      </button> */}

      <SelectNetwork
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        modalState={modalState}
        resetState={resetState}
        handleClickForOthers={handleSelection}
        setIsLoading={setIsLoading}
        handleClickForKusama={handleSelectionOnKusamaMainNetwork}
        style={{
          position: 'relative',
          width: '78%',
          minHeight: 240,
          background: '#141414',
          pb: 3,
          height: '320px',
          overflowY: 'scroll',
          overflowX: 'hidden',
          marginTop: '9rem',
        }}
        isLoading={isLoading}
      />
      <TxDetails
        open={isTxDetailsModalOpen}
        handleClose={() => setIsTxDetailsModalOpen(false)}
        txDetailsModalData={txDetailsModalData}
        transactionData={transactions}
        style={{
          width: '78%',
          background: '#141414',
          position: 'relative',
          p: 2,
          px: 2,
          pb: 3,
          // mt: 15,
        }}
      />
      {/* <button onClick={sendTransaction}>Send</button> */}
      <button onClick={decryptSeed}>Decrypt</button>
      {/* <button onClick={getbalanceKarura}>Get karura balance</button> */}
      {/* <button onClick={getExistentialDeposit}>Get existentialDeposit</button> */}
      {/* <button onClick={getTxFee}>Get Transaction fee</button> */}
      {/* <button onClick={getBloackDetails}>Get block details</button> */}
      {/* <button onClick={doTransaction}>Do transaction</button> */}
      {/* <button onClick={getMultipleTokensBalance}>Multiple tokens balance</button> */}
      {/* <button onClick={nonNativeTokenED}>Non native tokens ED</button> */}
      {/* <button onClick={setMultipleTokens}>Set multiple tokens</button> */}
      {/* <button onClick={getMultipleTokens}>Get multiple tokens</button> */}
      {/* <button onClick={fetchBalance}>Fetch</button> */}
      {/* <button onClick={multipleAddresses}>Multiple Addresses</button> */}
      {/* <button onClick={() => ss58_decode(publicKey)}>SS 58</button> */}
      <button onClick={() => console.log(' Redux =====>>>', currentUser)}>Get balance details</button>
      <button onClick={async () => {
        // const bal = await getBalance(currentUser.api.api, currentUser.account.publicKey);
        // console.log('BAL ||||', bal);

        // dispatch(setBalances(bal));
        dispatch(setBalances(getBalances()));
        console.log('Not soooo', getBalances());
      }}
      >
        Get
      </button>
      {/* <button onClick={() => convertIntoH160Address(publicKey)}>Eth</button> */}
      {/* <button onClick={getEthAddressFromEthersLib}> getEthAddressFromEthersLib </button> */}
      <button onClick={deposit}>Deposit</button>
      <button onClick={XCMP2}>XCMP</button>
    </Wrapper>
  );
}

export default Dashboard;
