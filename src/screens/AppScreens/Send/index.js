/* eslint-disable no-unused-vars */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addTransaction } from '../../../redux/slices/transactions';
import { helpers } from '../../../utils';
// eslint-disable-next-line no-unused-vars
import {
  getBalance, getSender, getTransactionFee,
} from '../../../utils/services';
import { setBalance } from '../../../redux/slices/account';
import {
  AuthWrapper, Button, ConfirmSend, Header,
} from '../../../components';
import {
  MainContent,
  CenterContent,
} from './StyledComponents';
import {
  setAuthScreenModal,
  setIsSuccessModalOpen,
  setMainTextForSuccessModal,
  setSubTextForSuccessModal,
  setConfirmSendModal,
} from '../../../redux/slices/successModalHandling';
import { decrypt } from '../../../utils/accounts';
import FromInput from './FromInput';
import ToInput from './ToInput';
import AmountInput from './AmountInput';
import constants from '../../../constants/onchain';
import AuthScreen from '../../../components/Modals/AuthScreen/AuthScreen';

const { Keyring } = require('@polkadot/api');

const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');
const BN = require('../../../utils/bn');

const errorMessages = {
  invalidAddress: 'Invalid address',
  enterAddress: 'Enter address',
  enterAmount: 'Enter amount',
};
const accountReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val !== action.valid };
  }
  if (action.type === 'IS_BLUR') {
    return { value: state.value, isValid: action.val !== action.valid };
  }
  return { value: '', isValid: false };
};

const amountReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {
      value: action.val,
      isValid: action.amountIsValid >= action.val,
    };
  }

  if (action.type === 'MAX_INPUT') {
    return {
      value: action.bal - action.txFee,
      isValid: true,
    };
  }

  if (action.type === 'IS_BLUR') {
    return {
      value: state.value,
      isValid: action.amountIsValid >= state.value,
    };
  }
  return { value: '', isValid: false };
};

const { addressModifier } = helpers;

const Send = () => {
  // eslint-disable-next-line no-unused-vars
  const [insufficientBal, setInsufficientBal] = useState();
  const [loading1, setLoading1] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  // fill this state  from redux
  // eslint-disable-next-line no-unused-vars
  const [accountFrom, setAccountFrom] = useState('');
  const [isCorrect, setIsCorrect] = useState(true);
  const [transactionFee, setTransactionFee] = useState(0);
  const [error, setError] = useState({
    amountError: false,
    address: false,
  });

  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector((state) => state);
  const { api } = currentUser.api;
  const { rpcUrl } = currentUser.account;
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  // const [accountTo, setAccountTo] = useState('');
  const [accountToSate, accountDispatch] = useReducer(accountReducer, {
    value: '',
    isValid: null,
  });
  // const [amount, setAmount] = useState('');
  const [amountState, amountDispatch] = useReducer(amountReducer, {
    value: '',
    isValid: null,
  });
  const [formIsValid, setFormIsValid] = useState(false);

  // eslint-disable-next-line prefer-const
  let data = {
    accountFrom: currentUser.account.publicKey,
    accountTo: accountToSate.value,
    amount: amountState.value,
    hash: '',
    operation: '',
    status: '',
    chainName: currentUser.account.chainName,
    tokenName: currentUser.account.tokenName,
    transactionFee,
  };

  const { isValid } = accountToSate;
  const { isValid: amountIsValid } = amountState;
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    setTimeout(() => {
      setFormIsValid(isValid && amountState.isValid);
    }, 600);

    return () => {
      clearTimeout();
    };
  }, [isValid, amountIsValid, amountState.isValid]);

  const accountToChangeHandler = (e) => {
    accountDispatch({ type: 'USER_INPUT', val: e, valid: currentUser.account.publicKey });
  };

  const accountToIsValid = () => {
    accountDispatch({ type: 'IS_BLUR' });
  };

  const amountHandler = (e) => {
    setInsufficientBal();
    amountDispatch({ type: 'USER_INPUT', val: e, amountIsValid: currentUser.account.balance });
  };

  const amountIsValidHandler = () => {
    amountDispatch({ type: 'IS_BLUR' });
  };

  const convertTransactionFee = (fee) => {
    const splitFee = fee.split(' ');
    if (currentUser.account.tokenName === 'WND') {
      return (splitFee[0] * 10 ** -3).toFixed(4);
    }
    if (currentUser.account.tokenName === 'KSM') {
      return (splitFee[0] * 10 ** -6).toFixed(4);
    }
    if (currentUser.account.tokenName === 'PLD') {
      return splitFee[0];
    }
    if (currentUser.account.tokenName === 'ACA') {
      return (splitFee[0] * 10 ** -3).toFixed(4);
    }
    if (currentUser.account.tokenName === 'ROC') {
      return (splitFee[0] * 10 ** -3).toFixed(4);
    }
    if (currentUser.account.tokenName === 'DOT') {
      return (splitFee[0] * 10 ** -3).toFixed(4);
    }
    if (currentUser.account.tokenName === 'SBY') {
      return (splitFee[0] * 10 ** -3).toFixed(4);
    }
    return true;
  };

  const getBloackDetails = async (blockHash, sender) => {
    // const block = await currentUser.api.api.rpc.chain
    // .getBlock('0xded7e4ae1d2011f1628ee9d7e34d417cdc64c77c13e02d2ae7549d6903d7c6fd');
    // block.block.extrinsics.map((ex) => console.log(ex.hash));

    const signedBlock = await currentUser.api.api.rpc.chain.getBlock(blockHash);

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
          alert('Signer matched');
          return ex.hash.toHuman();
        }
        console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
      }
      return false;
    });
  };

  const maxInputHandler = async () => {
    console.log('Start*******');
    // const decimalPlaces = await api.registry.chainDecimals;
    // const info = await api.tx.balances
    //   .transfer(currentUser.account.publicKey, amountState.value * 10 ** decimalPlaces)
    //   .paymentInfo(accountToSate.value);

    // const txFee = await convertTransactionFee(info.partialFee.toHuman());
    // console.log('transaction fee ---------', txFee);
    // amountDispatch({ type: 'MAX_INPUT', bal: currentUser.account.balance, txFee });
    // console.log('End--------------');
  };

  // Check the sender existential deposit
  const validateTxErrors = async () => {
    const decimalPlaces = await currentUser.api.api.registry.chainDecimals[0];

    // const recipientBalance = await getBalance(api, accountToSate.value);
    // if (currentUser.account.rpcUrl === constants.ACALA_MANDALA_CONFIG.RPC_URL) {
    //   recipientBalance = await
    //   getBalanceWithMultipleTokens(api, accountToSate.value);
    // } else {
    const recipientBalance = await getBalance(api, accountToSate.value);
    // }
    const senderBalance = currentUser.account.balance;
    console.log('TYPE [][]', typeof recipientBalance, typeof amountState.value);
    console.log('Recipient balance + amount to state', Number(recipientBalance) + Number(amountState.value));

    console.log('Sender balance after tx', (senderBalance - amountState.value) * 10 ** decimalPlaces);
    console.log('ED of the chain', currentUser.api.api.consts.balances.existentialDeposit);

    if (currentUser.api.api.consts.balances.existentialDeposit
     // eslint-disable-next-line eqeqeq
     > (recipientBalance + amountState.value) * 10 ** decimalPlaces
    // eslint-disable-next-line operator-linebreak
    //    || senderBalance - amountState.value <
    //  currentUser.api.api.consts.balances.existentialDeposit
    ) {
      // Show warning modal
      alert('Existential deposit warning. The transaction might get failed');
      // alert('Warning modal, the transaction might get failed');
    }
    if ((senderBalance - amountState.value) * 10 ** decimalPlaces
      < currentUser.api.api.consts.balances.existentialDeposit) {
      alert('Existential deposit warning. The sender account might get reaped');
    }
  };

  const doTransaction = async (deSeed) => {
    try {
      console.clear();
      const keyring = new Keyring({ type: 'sr25519' });

      const decimalPlaces = await api.registry.chainDecimals;
      console.log('b');
      setLoading2(true);
      console.log('c');
      const sender = keyring.addFromUri(deSeed);
      data.operation = 'Send';
      const decimals = decimalPlaces.length > 1
        ? decimalPlaces[0] : decimalPlaces;
      console.log('Decimals', decimals);
      const amountSending = amountState.value * 10 ** decimals;
      // eslint-disable-next-line no-undef
      console.log('Amount sending', BigInt(amountSending));
      // console.log('Amount sending into BN [][] ...', new BN(amountSending));

      const tx = currentUser.api.api.tx.balances
        .transfer(
        // eslint-disable-next-line no-undef
          accountToSate.value, BigInt(amountSending),
        );

      // const result = await transfer.signAndSend(
      //   sender, ({ status, events, dispatchError }) => {
      //     if (status.isInBlock) {
      //       if (dispatchError) {
      //         if (dispatchError.isModule) {
      //           alert('Tx failed');
      //           // for module errors, we have the section indexed, lookup
      //           const decoded = api.registry.findMetaError(dispatchError.asModule);
      //           const { docs, name, section } = decoded;

      //           console.log(`${section}.${name}: ${docs.join(' ')}`);
      //         } else {
      //         // Other, CannotLookup, BadOrigin, no extra info
      //           console.log(dispatchError.toString());
      //         }
      //       } else {
      //         alert('Tx successfull');
      //         console.log('Tx successfull');
      //       }
      //     }
      //   },
      // );

      console.log('Amount sending .....', amountState.value * 10 ** decimals);
      const result = tx.signAndSend(sender, ({ status, events }) => {
      // if (status.isInBlock) txStatus = status.isInBlock;
        const txResSuccess = events
          .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event));
        const txResFail = events
          .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event));
        console.log('Tx res Success', txResSuccess.length);
        console.log('Tx res Fail', txResFail.length);
        if (status.isInBlock) {
          console.log('Tx hash', tx.hash.toHex());
          data.hash = tx.hash.toHex();
          if (txResFail.length >= 1) {
            console.log('Tx failed', txResFail.length);
            data.status = 'Failed';
            dispatch(addTransaction(data));
            setLoading2(false);
            dispatch(setConfirmSendModal(false));
            dispatch(setIsSuccessModalOpen(true));
            setIsSendModalOpen(false);
            dispatch(setMainTextForSuccessModal('Transaction Failed!'));
            dispatch(
              setSubTextForSuccessModal(''),
            );
            setTimeout(() => {
              dispatch(setIsSuccessModalOpen(false));
            }, 4000);
            // navigate to dashboard on success
            history.push('/');
          } if (txResSuccess.length >= 1) {
            console.log('Tx successfull');
            data.status = 'Successful';
            dispatch(addTransaction(data));
            setLoading2(false);
            setIsSendModalOpen(false);
            dispatch(setMainTextForSuccessModal('Transaction Successful!'));
            dispatch(
              setSubTextForSuccessModal(''),
            );
            dispatch(setIsSuccessModalOpen(true));
            setTimeout(() => {
              dispatch(setIsSuccessModalOpen(false));
            }, 4000);
            history.push('/');
          }
        }
      })
        .then((res) => {
          console.log('Res', res);
        // console.log('Result .....', result);
        })
        .catch((err) => {
        // console.log('Tx hash', tx.hash.toHex());
          data.hash = tx.hash.toHex();
          alert('Tx failed');
          console.log('Error', err);
          data.status = 'Failed';
          dispatch(addTransaction(data));
          setLoading2(false);
          dispatch(setConfirmSendModal(false));
          dispatch(setIsSuccessModalOpen(true));
          setIsSendModalOpen(false);
          dispatch(setMainTextForSuccessModal('Transaction Failed!'));
          dispatch(
            setSubTextForSuccessModal(''),
          );
          setTimeout(() => {
            dispatch(setIsSuccessModalOpen(false));
          }, 4000);
          // navigate to dashboard on success
          history.push('/');
        });
      console.log('Result [][]', result);
      // const txResSuccess = events
      //   .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event));
      // const txResFail = events
      //   .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event));
      // console.log('Tx res Success', txResSuccess.length);
      // console.log('Tx res Fail', txResFail.length);
      // console.log('Dispatch error', dispatchError);
      // if (status.isInBlock) {
      //   console.log('Hash of tx', tx.hash.toHex());
      //   data.hash = tx.hash.toHex();
      //   if (dispatchError) {
      //     data.status = 'Failed';
      //     dispatch(addTransaction(data));
      //     setLoading2(false);
      //     dispatch(setConfirmSendModal(false));
      //     dispatch(setIsSuccessModalOpen(true));
      //     setIsSendModalOpen(false);
      //     dispatch(setMainTextForSuccessModal('Transaction Failed!'));
      //     dispatch(
      //       setSubTextForSuccessModal(''),
      //     );
      //     setTimeout(() => {
      //       dispatch(setIsSuccessModalOpen(false));
      //     }, 3500);
      //     // navigate to dashboard on success
      //     history.push('/');
      //     // if (dispatchError.isModule) {
      //   alert('Tx failed');
      //   // for module errors, we have the section indexed, lookup
      //   const decoded = api.registry.findMetaError(dispatchError.asModule);
      //   const { docs, name, section } = decoded;

      //   console.log(`${section}.${name}: ${docs.join(' ')}`);
      // } else {
      //   // Other, CannotLookup, BadOrigin, no extra info
      //   console.log('T', dispatchError.toString());
      // }
      //     } else {
      //       alert('Tx successfull');
      //       console.log('Tx successfull');
      //       data.status = 'Successful';
      //       dispatch(addTransaction(data));
      //       setLoading2(false);
      //       setIsSendModalOpen(false);
      //       dispatch(setMainTextForSuccessModal('Transaction Successful!'));
      //       dispatch(
      //         setSubTextForSuccessModal(''),
      //       );
      //       dispatch(setIsSuccessModalOpen(true));
      //       setTimeout(() => {
      //         dispatch(setIsSuccessModalOpen(false));
      //       }, 3500);
      //       history.push('/');
      //     }
      //   }
      // });
      // .then((res) => console.log('Res', res)
      // .catch((err) => console.log('Error', err))
      //   .then((res) => console.log('In then res ===>>>', res.toHex()))
      //   .catch((err) => console.log('In catch error ====>>>>', err));
      // console.log('Result', result);
      // async ({ status, events }) => {
      //   console.log('Status', status.isInBlock, status.isFinalized);
      //   console.log('Events [][]', events);

      // const txResSuccess = events
      //   .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event));
      // const txResFail = events
      //   .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event));
      // console.log('Tx res Success', txResSuccess.length);

      // if (status.isInBlock || status.isFinalized) {
      //   events
      //     .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event))
      //     .forEach(async ({ event }) => {
      //       console.log('Transaction success');
      //       console.log('Event', event);
      //       if (status.isInBlock) {
      //         console.log('Hash of TX', status.asInBlock.toString());
      //         data.hash = status.asInBlock.toString();
      //       }
      //     });

      // navigate to dashboard on success

      // if (txResSuccess.length >= 1) {
      //   try {
      //     console.log('Tx is successfull');
      //     data.status = 'Successful';
      //     dispatch(addTransaction(data));
      //     setLoading2(false);
      //     setIsSendModalOpen(false);
      //     dispatch(setMainTextForSuccessModal('Transaction Successful!'));
      //     dispatch(
      //       setSubTextForSuccessModal(''),
      //     );
      //     dispatch(setIsSuccessModalOpen(true));
      //     setTimeout(() => {
      //       dispatch(setIsSuccessModalOpen(false));
      //     }, 3500);
      //     history.push('/');
      //   } catch (err) {
      //     console.log('successfull block ran second time error---', err);
      //   }
      // } else if (txResFail.length >= 1) {
      //   data.status = 'Failed';
      //   console.log('Tx is failed');
      //   alert('Transaction failed');
      //   dispatch(addTransaction(data));
      //   setLoading2(false);
      //   dispatch(setConfirmSendModal(false));
      //   dispatch(setIsSuccessModalOpen(true));
      //   dispatch(setMainTextForSuccessModal('Transaction Failed!'));
      //   dispatch(
      //     setSubTextForSuccessModal(''),
      //   );
      //   setTimeout(() => {
      //     dispatch(setIsSuccessModalOpen(false));
      //   }, 3500);
      //   // navigate to dashboard on success
      //   history.push('/');
      // }
      // },
      // ).then((res) => console.log('Res', res.toHex()))
      //   .catch((err) => console.log('Error', err));

      // .then((res, status, events) => {
      //   console.log('The transaction Hash', res.toHex());
      //   console.log('Status:', status);
      //   console.log('events:', events);
      //   alert('Tx successfull');
      //   console.log('Tx is successfull');
      //   data.status = 'Successful';
      //   // data.hash = res.toHex();
      //   dispatch(addTransaction(data));
      //   setLoading2(false);
      //   setIsSendModalOpen(false);
      //   dispatch(setMainTextForSuccessModal('Transaction Successful!'));
      //   dispatch(
      //     setSubTextForSuccessModal(''),
      //   );
      //   dispatch(setConfirmSendModal(false));
      //   dispatch(setIsSuccessModalOpen(true));
      //   setTimeout(() => {
      //     dispatch(setIsSuccessModalOpen(false));
      //   }, 3500);
      //   history.push('/');
      // })
      // .catch((err) => {
      //   data.status = 'Failed';
      //   console.error('Error [][][]', err);
      //   alert('Transaction failed');
      //   dispatch(addTransaction(data));
      //   setLoading2(false);
      //   dispatch(setConfirmSendModal(false));
      //   dispatch(setIsSuccessModalOpen(true));
      //   dispatch(setMainTextForSuccessModal('Transaction Failed!'));
      //   dispatch(
      //     setSubTextForSuccessModal(''),
      //   );
      //   setTimeout(() => {
      //     dispatch(setIsSuccessModalOpen(false));
      //   }, 3500);
      // // navigate to dashboard on failed
      // // history.push('/');
      // });
      // console.log('Hash', hash);
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  };

  const sendTransaction = async (deSeed) => {
    // try {
    console.log('a');
    const decimalPlaces = await api.registry.chainDecimals;
    console.log('b');
    setLoading2(true);
    console.log('c');
    const keyring = new Keyring({ type: 'sr25519' });
    const sender = keyring.addFromUri(deSeed);
    data.operation = 'Send';
    const decimals = decimalPlaces.length > 1
      ? decimalPlaces[0] : decimalPlaces;
    const result = await api.tx.balances
      .transfer(
        accountToSate.value, amountState.value * 10 ** decimals,
      )
      .signAndSend(
        sender, async ({ status, events }) => {
          console.log('Status', status.isInBlock, status.isFinalized);
          console.log('EVents', events);
          const txResSuccess = events
            .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event));
          const txResFail = events
            .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event));
          console.log('Tx res Success', txResSuccess.length);

          if (status.isInBlock || status.isFinalized) {
            events
              .filter(({ event }) => api.events.system.ExtrinsicSuccess.is(event))
              .forEach(async ({ event }) => {
                console.log('Transaction success');
                console.log('Event', event);
                if (status.isInBlock) {
                  console.log('Hash of TX', status.asInBlock.toString());
                  data.hash = status.asInBlock.toString();
                }
              });

            // navigate to dashboard on success
          }
          if (txResSuccess.length >= 1) {
            try {
              console.log('Tx is successfull');
              data.status = 'Successful';
              dispatch(addTransaction(data));
              setLoading2(false);
              setIsSendModalOpen(false);
              dispatch(setMainTextForSuccessModal('Transaction Successful!'));
              dispatch(
                setSubTextForSuccessModal(''),
              );
              dispatch(setIsSuccessModalOpen(true));
              setTimeout(() => {
                dispatch(setIsSuccessModalOpen(false));
              }, 3500);
              history.push('/');
            } catch (err) {
              console.log('successfull block ran second time error---', err);
            }
          } else if (txResFail.length >= 1) {
            data.status = 'Failed';
            console.log('Tx is failed');
            alert('Transaction failed');
            dispatch(addTransaction(data));
            setLoading2(false);
            dispatch(setConfirmSendModal(false));
            dispatch(setIsSuccessModalOpen(true));
            dispatch(setMainTextForSuccessModal('Transaction Failed!'));
            dispatch(
              setSubTextForSuccessModal(''),
            );
            setTimeout(() => {
              dispatch(setIsSuccessModalOpen(false));
            }, 3500);
            // navigate to dashboard on success
            history.push('/');
          }
        },
      )
      .catch((err) => {
        alert('Transaction failed in catch');
        setLoading2(false);
        console.error('Error [][][]', err);
      });

    // } catch (err) {
    // alert('An error occurred');
    // console.log('Error', err);
    // }
  };

  const validateInputValues = (address) => {
    if (currentUser.account.balance < amountState.value) {
      throw new Error('Insufficient funds');
    }
    if (!accountToSate.value) {
      setError((prevState) => ({
        ...prevState,
        address: true,
      }));
      throw new Error('Please enter address');
    }
    setError((prevState) => ({
      ...prevState,
      address: false,
    }));
    if (!isValidAddressPolkadotAddress(address)) return false;
    if (!amountState.value) {
      setError((prevState) => ({
        ...prevState,
        amountError: true,
      }));
      throw new Error('Please enter amount');
    }
    setError((prevState) => ({
      ...prevState,
      amountError: false,
    }));
    return true;
  };

  const isValidAddressPolkadotAddress = (address) => {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
      setIsCorrect(true);
      return true;
    } catch (err) {
      setIsCorrect(false);
      return false;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleSubmit = async () => {
    console.log('User balance', currentUser.account.balance);
    console.log('Redux state api []][]', rpcUrl);
    console.log('Check existential deposit', accountToSate);
    // if (rpcUrl === constants.ACALA_MANDALA_CONFIG.RPC_URL) {
    //   const bal = await getBalanceWithMultipleTokens(api, accountToSate.value);
    //   console.log('Recipient balance', bal);
    // } else {
    //   const bal = await getBalance(api, accountToSate.value);
    //   console.log('Recipient balance', bal);
    // }
    console.log('Submit working');
    try {
      setLoading1(true);
      const decimalPlaces = await api.registry.chainDecimals;
      console.log('Decimal places', decimalPlaces);
      console.log('Before validate tx errors');
      await validateTxErrors();
      console.log('After validate tx errors');
      if (!validateInputValues(accountToSate.value)) throw new Error('An error occurred');
      console.log('Before info');
      const info = await
      getTransactionFee(api, currentUser.account.publicKey,
        accountToSate.value, decimalPlaces, amountState.value);
      console.log('After info');
      const txFee = await convertTransactionFee(info.partialFee.toHuman());
      // const txFee = 1;
      console.log('After tx');
      console.log('TX fee', txFee);
      data.txFee = txFee;
      data.chainName = currentUser.account.chainName;
      setTransactionFee(txFee);
      setLoading1(false);
      // checking if balance is enough to send the amount with network fee
      if (currentUser.account.balance < (Number(amountState.value) + Number(txFee))) {
        setInsufficientBal(true);
        console.log('hello');
      } else {
        console.log('Open password modal');
        dispatch(setConfirmSendModal(true));
      }
    } catch (err) {
      console.log('In catch', err);
      setLoading1(false);
    }
  };

  const trimBalance = (value) => {
    const val = value.toString();
    const trimmedValue = val.slice(0, val.indexOf('.') + 6);
    return trimmedValue;
  };

  // eslint-disable-next-line no-unused-vars
  const getDetailsFromBlock = async () => {
    const signedBlock = await api.rpc.chain.getBlock('0xe4f1433292a5560ad8e699f8e28281a2266b1e2f9523c7dd0527086ffa25b876');

    // the information for each of the contained extrinsics
    signedBlock.block.extrinsics.forEach((ex, index) => {
      // the extrinsics are decoded by the API, human-like view
      const { isSigned, meta, method: { args, method, section } } = ex;

      // signer/nonce info
      if (isSigned) {
        console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
      }
    });
  };

  const fromInput = {
    addressModifier,
    currentUser,
  };

  const toInput = {
    accountToSate,
    currentUser,
    isCorrect,
    errorMessages,
    error,
    accountToChangeHandler,
    accountToIsValid,
  };

  const amountInput = {
    amountState,
    amountHandler,
    maxInputHandler,
    amountIsValidHandler,
    insufficientBal,
    currentUser,
    trimBalance,
    errorMessages,
    error,
  };

  const btn = {
    id: 'send-next',
    text: 'Next',
    width: '300px',
    handleClick: handleSubmit,
    disabled: !formIsValid || loading1,
    isLoading: loading1,
  };

  const confirmSend = {
    id: 'confirm-send',
    style: {
      width: '78%',
      background: '#141414',
      position: 'relative',
      p: 2,
      px: 2,
      pb: 3,
      mt: 10,
    },
    accountFrom: currentUser.account.publicKey,
    accountTo: accountToSate.value,
    amount: amountState.value,
    open: currentUser.successModalHandling.confirmSendModal,
    transactionFee,
    tokenName: currentUser.account.tokenName,
    fromAccountName: currentUser.account.accountName,

    handleClose: () => dispatch(setConfirmSendModal(false)),
    handleConfirm: doTransaction,
    loading2,
  };

  return (
    <AuthWrapper>
      <Header centerText="Send" backHandler={() => console.log('object')} />

      <MainContent>
        <FromInput {...fromInput} />
        <ToInput {...toInput} />
        <AmountInput {...amountInput} />
      </MainContent>

      <CenterContent>
        <Button {...btn} />
      </CenterContent>
      <ConfirmSend
        {...confirmSend}
      />
      <AuthScreen
        open={currentUser.successModalHandling.authScreenModal}
        handleClose={() => {
          dispatch(setAuthScreenModal(false));
          dispatch(setConfirmSendModal(true));
        }}
        sendTransaction={doTransaction}
        style={{
          width: '78%',
          background: '#141414',
          position: 'relative',
          p: 2,
          px: 2,
          pb: 3,
          mt: 25,
        }}
      />
    </AuthWrapper>
  );
};

export default Send;
