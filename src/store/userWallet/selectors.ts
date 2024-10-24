import {createSelector} from '@reduxjs/toolkit';

import {RootState} from '../store';

const selectedState = (state: RootState) => state.userWallet;

export const makeSelectWalletInitialized = createSelector(
  selectedState,
  state => state.initialized,
);

export const makeSelectAccounts = createSelector(
  selectedState,
  state => state.accounts,
);

export const makeSelectSelectedAccount = createSelector(
  selectedState,
  state => state.selectedAccount,
);

export const makeSelectSelectedAccountPublicKey = createSelector(
  selectedState,
  state => state.selectedAccount?.publicKey,
);

export const makeSelectSearchTokenList = createSelector(
  selectedState,
  state => state.searchTokenList,
);

export const makeSelectSelectedToken = createSelector(
  selectedState,
  state => state.selectedToken,
);

export const makeSelectBalanceLoading = createSelector(
  selectedState,
  state => state.balanceDetailState.fetching,
);

export const makeSelectUsdEquivalents = createSelector(selectedState, state => {
  return state.usdEquivalents || [];
});

export const makeSelectNonTransferableTokenList = createSelector(
  selectedState,
  state => {
    return state.nonTransferableTokenList || [];
  },
);

export const makeSelectHasAccount = createSelector(
  selectedState,
  state => state.accounts.length > 0,
);
