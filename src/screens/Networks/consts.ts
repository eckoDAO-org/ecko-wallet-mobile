import {TNetwork} from './components/Item/types';
import {EDefaultNetwork} from './types';
import {MAIN_NETWORK_API_URL, TEST_NETWORK_API_URL} from '../../api/constants';

export const defaultNetworksList: TNetwork[] = [
  {
    id: '1',
    network: EDefaultNetwork.mainnet,
    name: 'Mainnet',
    host: MAIN_NETWORK_API_URL,
    explorerUrl: 'https://explorer.chainweb.com/mainnet',
    isDefault: true,
  },
  {
    id: '2',
    network: EDefaultNetwork.testnet,
    name: 'Testnet',
    host: TEST_NETWORK_API_URL,
    explorerUrl: 'https://explorer.chainweb.com/testnet',
    isDefault: true,
  },
];
