import React, { useState } from 'react';
import { AssetCard, TxCard } from '../../../components';
import { fonts } from '../../../utils';

import {
  AssetsAndTransactionsWrapper,
  Tabs,
  TabSection,
} from './StyledComponents';

const { mainHeadingfontFamilyClass } = fonts;

function AssetsAndTransactions({
  handleOpenTxDetailsModal,
  setTxDetailsModalData,
  transactionData,
}) {
  const [isTab1Active, setIsTab1Active] = useState(true);
  const [isTab2Active, setIsTab2Active] = useState(false);

  // const transactions = useSelector((state) => state.transactions.transactions);
  // console.log('transactions', transactions);
  return (
    <AssetsAndTransactionsWrapper>
      <Tabs>
        <TabSection
          isActive={isTab1Active}
          className={mainHeadingfontFamilyClass}
          onClick={() => {
            setIsTab1Active(true);
            setIsTab2Active(false);
          }}
        >
          Assets
        </TabSection>
        <TabSection
          isActive={isTab2Active}
          className={mainHeadingfontFamilyClass}
          onClick={() => {
            setIsTab1Active(false);
            setIsTab2Active(true);
          }}
        >
          Transactions
        </TabSection>
      </Tabs>
      {isTab1Active && (
        <AssetCard
          name="Polkadot"
          shortName="DOT"
          amount={0}
          amountInUsd={0}
          logo="https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png"
        />
      )}
      {isTab2Active && (
        // eslint-disable-next-line arrow-body-style
        transactionData.map((transaction) => {
          return (
            <TxCard
              key={transaction.transactionHash}
              operation={transaction.operation}
              status={transaction.status}
              coin={transaction.coin}
              amount={transaction.amount}
              amountInUsd={transaction.amountInUSD}
              logo="https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png"
              handleClick={() => {
                setTxDetailsModalData(transaction);
                handleOpenTxDetailsModal();
              }}
            />
          );
        })
      )}

    </AssetsAndTransactionsWrapper>
  );
}

export default AssetsAndTransactions;
