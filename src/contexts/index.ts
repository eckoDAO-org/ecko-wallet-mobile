import {useContext} from 'react';
import {PactContext} from './Pact';
import {WalletConnectContext} from './WalletConnect';

export function usePactContext() {
  return useContext(PactContext);
}

export function useWalletConnectContext() {
  return useContext(WalletConnectContext);
}
