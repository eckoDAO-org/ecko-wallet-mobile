import React, {useMemo} from 'react';
import {View} from 'react-native';
import ContentHeader from './components/ContentHeader';
import {styles} from './styles';
import ListItem from './components/ListItem';
import {makeSelectSelectedAccount} from '../../../../store/userWallet/selectors';
import {TWallet} from '../../../../store/userWallet/types';
import {useShallowEqualSelector} from '../../../../store/utils';
import {defaultWallets} from '../../../../store/userWallet/const';

const AssetsList = React.memo(() => {
  const selectedAccount = useShallowEqualSelector(makeSelectSelectedAccount);

  const sortedWalletList = useMemo(() => {
    const wallets = selectedAccount?.wallets || [];

    const defaultTokensOrder = defaultWallets.reduce((acc, wallet, index) => {
      acc[wallet.tokenAddress] = index;
      return acc;
    }, {} as Record<string, number>);

    return [...wallets].sort((a, b) => {
      const aIsDefault = a.tokenAddress in defaultTokensOrder;
      const bIsDefault = b.tokenAddress in defaultTokensOrder;

      if (aIsDefault && bIsDefault) {
        return (
          defaultTokensOrder[a.tokenAddress] -
          defaultTokensOrder[b.tokenAddress]
        );
      }
      if (aIsDefault) return -1;
      if (bIsDefault) return 1;

      return a.tokenAddress.localeCompare(b.tokenAddress);
    });
  }, [selectedAccount?.wallets]);
  return (
    <View style={styles.wrapper}>
      <ContentHeader />
      <View style={styles.listWrapper}>
        {sortedWalletList.map((walletItem: TWallet, listIndex: number) => (
          <ListItem
            key={walletItem.tokenAddress}
            isFirst={listIndex === 0}
            walletItem={walletItem}
          />
        ))}
      </View>
    </View>
  );
});

export default AssetsList;
