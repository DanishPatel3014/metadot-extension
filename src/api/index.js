// /* eslint-disable max-len */
// /* eslint-disable no-unused-vars */
// // eslint-disable-next-line no-unused-vars
// import React, { useState, useEffect, memo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setApi, setApiInitializationStarts } from '../redux/slices/api';
// import { getBalance, providerInitialization, addressMapper } from '../utils/services';
// import {
//   setBalance, setBalanceInUsd, setTokenName, setBalances,
// } from '../redux/slices/account';
// import {
//   setIsSuccessModalOpen, setMainTextForSuccessModal,
//   setSubTextForSuccessModal,
// } from '../redux/slices/successModalHandling';
// import constants from '../constants/onchain';
// import { helpers } from '../utils';
// // import { addressMapper } from '../utils/services'

// const { ACALA_MANDALA_CONFIG } = constants;

// function ApiManager({ rpc }) {
//   // eslint-disable-next-line import/no-mutable-exports
//   const currentUser = useSelector((state) => state);
//   const { api, account, successModalHandling } = currentUser;
//   const { publicKey, chainName } = account;
//   const { loadingFor } = successModalHandling;
//   const [apiState, setApiState] = useState(api.api);
//   const [balanceDetails, setBalanceDetails] = useState([]);
//   const dispatch = useDispatch();

//   // eslint-disable-next-line no-shadow
//   const state = useSelector((state) => state);

//   const formatNumber = (number, decimals) => {
//     if (number.toString() === '0') return '0';
//     return (Number(number.toString()) / 10 ** decimals).toFixed(5);
//   };

//   const setMultipleTokens = async () => {
//     const allTokens = currentUser.api.api.registry.chainTokens;
//     const allDecimals = currentUser.api.api.registry.chainDecimals;
//     allTokens.map(async (singleToken, i) => {
//       const tokenData2 = currentUser.api.api.query
//         .tokens.accounts(publicKey, { Token: singleToken }, (result) => {
//           const bal = formatNumber(result.free, allDecimals[i]);
//           console.log(singleToken, bal);
//           console.log('Balance details', balanceDetails);

//           /// /  Add the IsNative logic here  ////
//           setBalanceDetails((prevState) => [...prevState,
//             {
//               tokenName: singleToken, balance: bal, decimals: allDecimals[i], isNative: false,
//             }]);
//         });
//     });
//   };

//   const getBalOfSingleToken = async (ap, token, dec, i)
// => ap(publicKey, { Token: token }, async (result) => {
//     const bal = formatNumber(result.free, dec[i]);
//     console.log('Arr data', token, bal);
//     console.log('Balance details', balanceDetails);
//     /// /  Add the IsNative logic here  ////
//     // balances = Object.assign([], balances);

//     // balances.push({ name: token, balance: bal });
//     // temp.push({
//     //   name: token, balance: bal, decimals: dec[i], isNative: false,
//     // });
//     console.log('+++++++++++++++++++', {
//       name: token, balance: bal, decimals: dec[i], isNative: false,
//     });
//     const res = {
//       name: token, balance: bal, decimals: dec[i], isNative: false,
//     };
//     return res;
//     // setBalanceDetails((prevState) => [
//     //   ...prevState,
//     //   {
//     //     tokenName: token, balance: bal, decimals: decimals[i], isNative: false,
//     //   },
//     // ]);
//   });

//   const arr = [];
//   const getBalanceOfTokens = async (tokens, decimals, apiR) => {
//     // const temp = [];
//     // setBalanceDetails(temp);
//     console.log('APIR', apiR);
//     console.log('Tokens', tokens, decimals);
//     // let balances = [];
//     // const allTokens = apiR.registry.chainTokens;
//     // const allDecimals = apiR.registry.chainDecimals;
//     let tokenData2;
//     // eslint-disable-next-line array-callback-return
//     const abc = tokens.map((singleToken, i) => {
//       const betBal = getBalOfSingleToken(apiR, singleToken, decimals,
// i).then((val) => console.log('val ================', val));

//       console.log('getBal +=======================', betBal);
//       return betBal;
//       // return betBal;
//       // tokenData2 = await apiR.query
//       //   .tokens.accounts(publicKey, { Token: singleToken }, (result) => {
//       //     const bal = formatNumber(result.free, decimals[i]);
//       //     console.log('Arr data', singleToken, bal);
//       //     console.log('Balance details', balanceDetails);
//       //     /// /  Add the IsNative logic here  ////
//       //     // balances = Object.assign([], balances);

//       //     // balances.push({ name: singleToken, balance: bal });
//       //     temp.push({
//       //       name: singleToken, balance: bal, decimals: decimals[i], isNative: false,
//       //     });
//       //     console.log('+++++++++++++++++++', {
//       //       name: singleToken, balance: bal, decimals: decimals[i], isNative: false,
//       //     });
//       //     return {
//       //       name: singleToken, balance: bal, decimals: decimals[i], isNative: false,
//       //     };
//       //     // setBalanceDetails((prevState) => [
//       //     //   ...prevState,
//       //     //   {
//       //     //     tokenName: singleToken, balance: bal, decimals: decimals[i], isNative: false,
//       //     //   },
//       //     // ]);
//       //   });
//     });
//     console.log('abc in api manager ==========', abc);
//     // setBalanceDetails(temp);
//     // console.log('abc in api manager ==========', abc);
//     // Promise.all(abc).then((values) => {
//     //   console.log('values =============', values);
//     // });
//     return 10;
//   };

//   useEffect(() => {
//     console.clear();
//     const setAPI = async (rpcUrl) => {
//       dispatch(setApiInitializationStarts(true));
//       const apiR = await providerInitialization(rpcUrl);
//       console.log('In api manager', apiR);
//       const tokenName = await apiR.registry.chainTokens[0];
//       const tokenLength = await apiR.registry.chainTokens.length;
//       console.log('In api manager token length', tokenLength);
//       dispatch(setTokenName({ tokenName }));
//       // const bal = await getBalance(apiR, publicKey);
//       // console.log('Dispatching in redux', bal);
//       console.log('abc 2');
//       const bal = await getBalanceOfTokens(await apiR.registry.chainTokens,
//         await apiR.registry.chainDecimals, await apiR.query.tokens.accounts).then(() => {
//         console.log('all tokens received =====================', balanceDetails);
//       });

//       console.log('abc');
//       dispatch(setBalances(balanceDetails));
//       const dollarAmount = await helpers.convertIntoUsd(tokenName, bal);
//       dispatch(setBalanceInUsd(dollarAmount));
//       await apiR.isReady;
//       setApiState(apiR);
//       dispatch(setApi(apiR));

//       dispatch(setApiInitializationStarts(false));
//       if (loadingFor === 'Api Initialization...') {
//         dispatch(setIsSuccessModalOpen(true));
//         dispatch(setMainTextForSuccessModal('Successfully Converted!'));
//         dispatch(setSubTextForSuccessModal(''));

//         setTimeout(() => {
//           dispatch(setIsSuccessModalOpen(false));
//         }, 3000);
//       }
//     };
//     setAPI(rpc);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [chainName, publicKey, loadingFor, dispatch, rpc]);

//   console.log('The end', arr);
//   return (
//     <div style={{ display: 'none' }}>
//       <p>this</p>
//     </div>
//   );
// }

// export default memo(ApiManager);

/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApi, setApiInitializationStarts } from '../redux/slices/api';
import {
  providerInitialization, addressMapper, getBalanceWithSingleToken,
  getBalanceWithMultipleTokens,
} from '../utils/services';
import {
  setBalance, setBalanceInUsd, setTokenName, setBalances,
  updateSingleTokenBalance,
} from '../redux/slices/account';
import {
  setIsSuccessModalOpen, setMainTextForSuccessModal,
  setSubTextForSuccessModal,
} from '../redux/slices/successModalHandling';
import constants from '../constants/onchain';
import { helpers } from '../utils';
// import { addressMapper } from '../utils/services'
const { ACALA_MANDALA_CONFIG } = constants;
function ApiManager({ rpc }) {
  // eslint-disable-next-line import/no-mutable-exports
  const currentUser = useSelector((state) => state);
  const { api, account, successModalHandling } = currentUser;
  const { publicKey, chainName } = account;
  const { loadingFor } = successModalHandling;
  const [apiState, setApiState] = useState(api.api);
  const [balanceDetails, setBalanceDetails] = useState([]);
  const dispatch = useDispatch();
  let abc = [];
  // eslint-disable-next-line no-shadow
  const state = useSelector((state) => state);
  const formatNumber = (number, decimals) => {
    if (number.toString() === '0') return '0';
    return (Number(number.toString()) / 10 ** decimals).toFixed(5);
  };
  const setMultipleTokens = async () => {
    const allTokens = currentUser.api.api.registry.chainTokens;
    const allDecimals = currentUser.api.api.registry.chainDecimals;
    allTokens.map(async (singleToken, i) => {
      const tokenData2 = currentUser.api.api.query
        .tokens.accounts(publicKey, { Token: singleToken }, (result) => {
          const bal = formatNumber(result.free, allDecimals[i]);
          console.log(singleToken, bal);
          console.log('Balance details', balanceDetails);
          /// /  Add the IsNative logic here  ////
          setBalanceDetails((prevState) => [...prevState,
            {
              tokenName: singleToken, balance: bal, decimals: allDecimals[i], isNative: false,
            }]);
        });
    });
  };
  const getBalOfSingleToken = async (ap, token, dec, i, tokensLength) => {
    try {
      // console.clear();
      // eslint-disable-next-line consistent-return
      await ap.query.tokens.accounts(publicKey, { Token: token }, async (result) => {
        const bal = formatNumber(result.free, dec[i]);
        console.log('Arr data', token, bal);
        await updateBalanceForNonNativeTokens(token, bal);
        console.log('abc start', abc);
        console.log('return from callback +++++++++++++++++++', {
          name: token, balance: bal, decimals: dec[i], isNative: false,
        });
        console.log('iiiiiiii', i);
        const nativeTokenBalance = await getBalanceWithMultipleTokens(ap, publicKey);
        console.log('Native token balance', nativeTokenBalance);
        // abc = JSON.parse(JSON.stringify(abc));
        // abc = { ...abc };
        if (i === 0) {
          console.log('Hello in if');
          console.log('Abc ====>>>>', abc);
          abc.push({
            name: token, balance: nativeTokenBalance, decimals: dec[i], isNative: true,
          });
        } else {
          console.log('hello in else');
          if (tokensLength !== abc.length) {
            abc.push({
              name: token, balance: bal, decimals: dec[i], isNative: false,
            });
          }
          if (tokensLength - 1 === i) {
            dispatch(setBalances(abc));
            setBalanceDetails(abc);
            console.log('============================== the end', abc);
          }
        }
      });
      console.log('abc end', abc);
    } catch (err) {
      console.log('In catch abc', abc);
      console.log('Error', err);
    }
  };
  const arr = [];
  const getBalanceOfTokens = async (tokens, decimals, apiR) => {
    console.log('APIR', apiR);
    console.log('Tokens', tokens, decimals);
    console.log('Balance details', balanceDetails);
    abc = [];
    // Promise.all(
    tokens.map((singleToken, i) => getBalOfSingleToken(apiR, singleToken, decimals, i, tokens.length));
    // );
  };

  const updateBalanceForNonNativeTokens = async (tokenName, balance) => {
    console.log('updateBalanceForNonNativeTokens', tokenName, balance);
    await currentUser.account.balances.map((singleToken, i) => {
      console.log('updateBalanceForNonNativeTokens', singleToken);
      if (singleToken.name === tokenName && balance !== singleToken.balance) {
        // Single token balance changed
        console.log('Single token balance changed', tokenName, balance);
        dispatch(updateSingleTokenBalance({ name: tokenName, balance }));
      }
      return true;
    });
  };

  useEffect(() => {
    // console.clear();
    const setAPI = async (rpcUrl) => {
      dispatch(setApiInitializationStarts(true));
      const apiR = await providerInitialization(rpcUrl);
      console.log('In api manager', apiR);
      const tokenName = await apiR.registry.chainTokens[0];
      const tokenLength = await apiR.registry.chainTokens.length;
      console.log('In api manager token length', tokenLength);
      dispatch(setTokenName({ tokenName }));
      // const bal = await getBalance(apiR, publicKey);
      // console.log('Dispatching in redux', bal);
      console.log('abc 2');
      if (tokenLength > 1) {
        const bal = await getBalanceOfTokens(await apiR.registry.chainTokens,
          await apiR.registry.chainDecimals, apiR);
        console.log('abc');
      } else {
        const allTokens = apiR.registry.chainTokens;
        const allDecimals = apiR.registry.chainDecimals;
        const bal = await getBalanceWithSingleToken(apiR, publicKey);
        console.log('BAL in API manager [][]', bal);
        abc.push({
          name: allTokens[0], balance: bal, decimals: allDecimals[0], isNative: true,
        });
        dispatch(setBalances(abc));
      }
      // dispatch(setBalances(abc));
      // dispatch(setBalances(balanceDetails));
      // const dollarAmount = await helpers.convertIntoUsd(tokenName, bal);
      // dispatch(setBalanceInUsd(dollarAmount));
      await apiR.isReady;
      setApiState(apiR);
      dispatch(setApi(apiR));
      dispatch(setApiInitializationStarts(false));
      if (loadingFor === 'Api Initialization...') {
        dispatch(setIsSuccessModalOpen(true));
        dispatch(setMainTextForSuccessModal('Successfully Converted!'));
        dispatch(setSubTextForSuccessModal(''));
        setTimeout(() => {
          dispatch(setIsSuccessModalOpen(false));
        }, 3000);
      }
    };
    setAPI(rpc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainName, publicKey, loadingFor, dispatch, rpc]);
  console.log('The end', { balanceDetails });
  return (
    <div style={{ display: 'none' }}>
      <p>this</p>
    </div>
  );
}
export default memo(ApiManager);
