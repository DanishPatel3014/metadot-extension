/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import chrome from '@polkadot/extension-inject/chrome';
import { setApi, setApiInitializationStarts } from '../redux/slices/api';
import { setBalance, setBalanceInUsd, setTokenName } from '../redux/slices/activeAccount';
import {
  setIsResponseModalOpen, setMainTextForSuccessModal,
  setSubTextForSuccessModal,
} from '../redux/slices/modalHandling';
import { helpers } from '../utils';
import services from '../utils/services';
import { setPort } from '../redux/slices/communicate';
import { addListener } from '../messaging';

const { convertIntoUsd } = helpers;
const { getBalance, providerInitialization, getBalanceWithMultipleTokens } = services;

function ApiManager({ rpc }) {
  // eslint-disable-next-line import/no-mutable-exports
  const currentUser = useSelector((state) => state);
  const {
    api, activeAccount, modalHandling, communicate,
  } = currentUser;
  const { publicKey, chainName } = activeAccount;
  const { loadingFor } = modalHandling;
  const [apiState, setApiState] = useState(api.api);
  const dispatch = useDispatch();

  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state);
  useEffect(() => {
    const setAPI = async (rpcUrl) => {
      dispatch(setApiInitializationStarts(true));
      const apiR = await providerInitialization(rpcUrl);
      console.log('In api manager', apiR);
      const tokenName = await apiR.registry.chainTokens[0];
      const tokenLength = await apiR.registry.chainTokens.length;
      console.log('In api manager token length', tokenLength);
      dispatch(setTokenName({ tokenName }));
      const bal = await getBalance(apiR, publicKey);

      dispatch(setBalance(bal));
      const dollarAmount = await convertIntoUsd(tokenName, bal);

      dispatch(setBalanceInUsd(dollarAmount));

      console.log('api before isReady ==>>', apiR);
      // await apiR.isReady;
      setApiState(apiR);
      localStorage.setItem('rpcUrl', rpcUrl);
      // if (communicate.port.disconnect)communicate.port.disconnect();
      const port = chrome.runtime.connect({ name: 'extension' });
      dispatch(setPort(port));
      addListener();
      dispatch(setApi(apiR));

      dispatch(setApiInitializationStarts(false));
      if (loadingFor === 'Api Initialization...') {
        dispatch(setIsResponseModalOpen(true));
        dispatch(setMainTextForSuccessModal('Successfully Converted!'));
        dispatch(setSubTextForSuccessModal(''));

        setTimeout(() => {
          dispatch(setIsResponseModalOpen(false));
        }, 3000);
      }
    };

    setAPI(rpc);
  }, [chainName, publicKey, loadingFor, dispatch, rpc, communicate.port]);
  return (
    <div style={{ display: 'none' }}>
      <p>this</p>
    </div>
  );
}

export default memo(ApiManager);
