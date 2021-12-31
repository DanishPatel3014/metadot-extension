/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import constants from '../../constants/onchain';

const { POLKADOT_CONFIG } = constants;

const initialState = {
  seed: '',
  isLoggedIn: false,
  publicKey: '',
  accountName: '',
  rpcUrl: POLKADOT_CONFIG.RPC_URL,
  chainName: POLKADOT_CONFIG.CHAIN_NAME,
  tokenName: POLKADOT_CONFIG.TOKEN_NAME,
  balance: 0,
  balanceInUsd: 0,
  keyringInitialized: false,
  balances: [],
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setKeyringInitialized: (state, action) => {
      state.keyringInitialized = action.payload;
    },
    deleteRedux: (state, action) => {
      state.publicKey = action.payload;
    },
    setSeed: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.seed = action.payload;
    },
    resetAccountSlice: (state, action) => {
      state.seed = '';
      state.publicKey = '';
      state.isLoggedIn = false;
      state.accountName = '';
      state.balance = 0;
      state.balanceInUsd = false;
    },
    emptySeedInAccountSlice: (state) => {
      state.seed = '';
    },
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
    setAccountName: (state, action) => {
      state.accountName = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setRpcUrl: (state, action) => {
      state.rpcUrl = action.payload.rpcUrl;
    },
    setTokenName: (state, action) => {
      state.tokenName = action.payload.tokenName;
    },
    setChainName: (state, action) => {
      state.chainName = action.payload.chainName;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setBalanceInUsd: (state, action) => {
      state.balanceInUsd = action.payload;
    },
    // setBalances: (state, action) => ({
    //   // state.balances = action.payload;
    //   ...state,
    //   balances: [...state.balances, action.payload],
    // }),
    setBalances: (state, action) => {
      console.log('Bye Action payload ====>>>>', action.payload);
      state.balances = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSeed,
  resetAccountSlice,
  setPublicKey,
  setAccountName,
  setLoggedIn,
  setRpcUrl,
  setTokenName,
  setChainName,
  setBalance,
  setBalanceInUsd,
  deleteRedux,
  setKeyringInitialized,
  setBalances,
} = accountSlice.actions;

export default accountSlice.reducer;
