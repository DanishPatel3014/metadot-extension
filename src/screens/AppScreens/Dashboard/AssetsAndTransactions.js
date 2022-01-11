/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AssetCard, TxCard } from '../../../components';
import { fonts, helpers } from '../../../utils';
import {
  AssetsAndTransactionsWrapper,
  Tabs,
  TabSection,
} from './StyledComponents';

// Assests Token images
import dusty from '../../../assets/images/tokenImg/dusty.png';
import kusamaKsm from '../../../assets/images/tokenImg/kusama-ksm.svg';
import polkadotDot from '../../../assets/images/tokenImg/polkadot.png';
import westendColour from '../../../assets/images/tokenImg/westend_colour.svg';
import acala from '../../../assets/images/tokenImg/acala-circle.svg';
import astar from '../../../assets/images/astar.png';
import rococo from '../../../assets/images/rococo.svg';
import karura from '../../../assets/images/karura.svg';

const { mainHeadingfontFamilyClass } = fonts;
const { trimBalance, reverseArray } = helpers;

function AssetsAndTransactions({
  handleOpenTxDetailsModal,
  setTxDetailsModalData,
  transactionData,
}) {
  const assetsData = useSelector((state) => state.account);
  const {
    chainName, tokenName, balance, balanceInUsd,
    balances,
  } = assetsData;
  const [isTab1Active, setIsTab1Active] = useState(true);
  const [isTab2Active, setIsTab2Active] = useState(false);
  const logoChangeHandler = (token) => {
    if (token === 'DOT') {
      return polkadotDot;
    } else if (token === 'KSM') {
      return kusamaKsm;
    } else if (token === 'WND') {
      return westendColour;
    } else if (token === 'PLD') {
      return dusty;
    } else if (token === 'ACA') {
      return acala;
    } else if (token === 'PLM') {
      return astar;
    } else if (token === 'ROC') {
      return rococo;
    } else if (token === 'KAR') {
      return karura;
    } else {
      return polkadotDot;
    }
  };

  const tabSectionAssets = {
    isActive: isTab1Active,
    className: mainHeadingfontFamilyClass,
    onClick: () => {
      setIsTab1Active(true);
      setIsTab2Active(false);
    },
  };

  const tabSectionTransactions = {
    isActive: isTab2Active,
    className: mainHeadingfontFamilyClass,
    onClick: () => {
      setIsTab1Active(false);
      setIsTab2Active(true);
    },
  };

  console.log('Assets data here', assetsData);
  return (
    <AssetsAndTransactionsWrapper>
      <Tabs>
        <TabSection {...tabSectionAssets}>
          Assets
        </TabSection>
        <TabSection {...tabSectionTransactions}>
          Transactions
        </TabSection>
      </Tabs>
      <div className="scrollbar">
        {isTab1Active && (
          balances.map((singleToken, i) => (
            // eslint-disable-next-line react/jsx-key
            <AssetCard
              name={chainName}
              shortName={singleToken.name}
              // amount={(trimBalance(singleToken.balance))}
              amount={singleToken.balance}
              amountInUsd={balanceInUsd}
              logo={logoChangeHandler(tokenName)}
              isNative={singleToken.isNative}
            />
          ))

        )}
        {isTab2Active && (
        // eslint-disable-next-line arrow-body-style
          transactionData.length > 0 && transactionData.map((transaction) => {
            const {
              hash, operation, status, tokenName: tokenNames, amount,
            } = transaction;

            const txCard = {
              coin: tokenNames,
              amountInUsd: tokenNames === 'WND' ? '$0' : '$0',
              logo: logoChangeHandler(tokenNames),
              handleClick: () => {
                setTxDetailsModalData(transaction);
                handleOpenTxDetailsModal();
              },
              operation,
              status,
              amount,
            };
            return (
              <TxCard key={hash} {...txCard} />
            );
          })
        )}
      </div>

    </AssetsAndTransactionsWrapper>
  );
}

export default AssetsAndTransactions;
