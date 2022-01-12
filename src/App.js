/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';

import { ResponseModal, TransactionProgress } from './components';
import { setIsResponseModalOpen } from './redux/slices/modalHandling';
import { setIsTransactionProgressModalOpen } from './redux/slices/transctionProgressModalHandling';
import ApiManager from './apiManager';
import { routes } from './utils';
import WelcomeBack from './screens/unAuthorized/welcomeBack';
import Authorize from './screens/notification/authorize';

import {
  setLoggedIn,
  setPublicKey,
  setAccountName,
} from './redux/slices/activeAccount';
import { addAccount } from './redux/slices/accounts';

import {
  subscribeAccounts,
  approveAuthRequest,
} from './messaging';

// import {
//   subscribeMetadataRequests, subscribeSigningRequests,
// } from './messaging';

const { AuthRoutes, UnAuthRoutes } = routes;

function App() {
  const [accounts, setAccounts] = useState([]);
  const [api, setApi] = useState([]);
  const [authRequests, setAuthRequests] = useState([]);
  // const [metaRequests, setMetaRequests] = useState([]);
  // const [signRequests, setSignRequests] = useState([]);

  useEffect(() => {
    subscribeAccounts(setAccounts);
    // subscribeAuthorizeRequests(setAuthRequests);
    // subscribeMetadataRequests(setMetaRequests),
    // subscribeSigningRequests(setSignRequests),
  }, []);

  useEffect(() => {
    const saveAccountInRedux = ({ name, address }) => {
      // update redux data and tracking flags accordingly
      dispatch(setLoggedIn(true));
      dispatch(setPublicKey(address));
      dispatch(setAccountName(name));
      // dispatch(setWalletPassword(hashedPassword));

      dispatch(addAccount({
        accountName: name,
        publicKey: address,
      }));
    };

    console.log('accounts ==>>', accounts);
    if (accounts.length > 0) {
      saveAccountInRedux(accounts[accounts.length - 1]);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  useEffect(() => {
    console.log('authRequests ==>>', authRequests);
  }, [authRequests]);

  // useEffect(() => {
  //   console.log('metaRequests ==>>', metaRequests);
  // }, []);

  // useEffect(() => {
  //   console.log('signRequests ==>>', signRequests);
  // }, []);

  // prettier-ignore
  const currentUser = useSelector((state) => state);
  console.log('app.js rereanderd');
  const {
    isResponseModalOpen, mainText, subText, responseImage,
  } = useSelector(
    (state) => state.modalHandling,
  );

  const {
    isTransactionProgressModalOpen,
    transactionProgressMainText,
    transactionProgressSubText,
  } = useSelector(
    (state) => state.transactionProgressModalHandling,
  );

  const dispatch = useDispatch();

  const renderFunction = () => {
    let content;
    if (authRequests && authRequests.length > 0) {
      content = <Authorize request={authRequests[0]} approve={approveAuthRequest} />;
    } else if (
      !currentUser.activeAccount.isLoggedIn
      && currentUser.activeAccount.publicKey
    ) {
      content = <WelcomeBack />;
    } else if (
      // prettier-ignore
      currentUser.activeAccount.isLoggedIn
      && currentUser.activeAccount.publicKey
    ) {
      content = (
        <div>
          <ApiManager rpc={currentUser.activeAccount.rpcUrl} />

          {AuthRoutes.map((route) => {
            const { path, Component } = route;
            return (
              <Route exact path={path} key={path}>
                <Component />
              </Route>
            );
          })}
        </div>
      );
    } else {
      content = (
        <div>
          {UnAuthRoutes.map((route) => {
            const { path, Component } = route;
            return (
              <Route exact path={path} key={path}>
                <Component />
              </Route>
            );
          })}
        </div>
      );
    }
    return content;
  };

  const responseModalStyle = {
    width: '78%',
    background: '#141414',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    bottom: 40,
  };

  const responseModal = {
    open: isResponseModalOpen,
    handleClose: () => dispatch(setIsResponseModalOpen(false)),
    style: responseModalStyle,
    subText,
    mainText,
    responseImage,
  };

  const transactionProgress = {
    open: isTransactionProgressModalOpen,
    handleClose: () => dispatch(setIsTransactionProgressModalOpen(false)),
    style: responseModalStyle,
    transactionProgressMainText,
    transactionProgressSubText,
  };

  return (
    <Router>
      <div className="App">
        <Switch>
          <div>
            {renderFunction()}

            {/* Dynamic Modal controlled by redux for successfully and
            unsuccessfully  executed processes
            overall the application */}
            <ResponseModal {...responseModal} />
            <TransactionProgress {...transactionProgress} />
          </div>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
