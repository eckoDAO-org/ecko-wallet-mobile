import React from 'react';
import SettingsSubPage from '../screens/SettingsSubPage';
import {EHomeTabRoutes, ERootStackRoutes} from './types';
import LogoGraySvg from '../assets/images/logo-gray.svg';
import LogoSvg from '../assets/images/logo.svg';
import SwapSvg from '../assets/images/swap.svg';
import History from '../screens/History';
import TimeHistorySvg from '../assets/images/time-history.svg';
import ConnectionSvg from '../assets/images/connect.svg';
import BasicSettingsSvg from '../assets/images/basic-settins.svg';
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import Home from '../navigation/Home';
import Networks from '../screens/Networks';
import Contacts from '../screens/Contacts';
import AddEditContact from '../screens/AddEditContact';
import AddEditNetwork from '../screens/AddEditNetwork';
import ExportRecoveryPhraseAuth from '../screens/ExportRecoveryPhraseAuth';
import ExportRecoveryPhrase from '../screens/ExportRecoveryPhrase';
import AddToken from '../screens/AddToken';
import ImportAccount from '../screens/ImportAccount';
import RecoveryFromSeeds from '../screens/RecoveryFromSeeds';
import RecoverAccount from '../screens/RecoverAccount';
import Connection from '../screens/Connection';
import WalletConnectScan from '../screens/WalletConnectScan';
import SearchTokens from '../screens/SearchTokens';
import SecretRecoveryPhrase from '../screens/SecretRecoveryPhrase';
import SecretRecoveryPhraseTerm from '../screens/SecretRecoveryPhraseTerm';
import Send from '../screens/Send';
import SendProgress from '../screens/SendProgress';
import SendSummary from '../screens/SendSummary';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignIn';
import Swap from '../screens/Swap';
import VerifyRecoveryPhrase from '../screens/VerifyRecoveryPhrase';
import Wallet from '../screens/Wallet';
import WalletConnectSettings from '../screens/WalletConnectSettings';
import Welcome from '../screens/Welcome';
import ChangeAccountPassword from '../screens/ChangeAccountPassword';
import ReceiverScan from '../screens/ReceiverScan';

export const AUTH_STACK_SCREENS = [
  {name: ERootStackRoutes.Welcome, component: Welcome},
  {name: ERootStackRoutes.Registration, component: Registration},
  {name: ERootStackRoutes.SignIn, component: SignIn},
  {name: ERootStackRoutes.Login, component: Login},
  {name: ERootStackRoutes.RecoveryFromSeeds, component: RecoveryFromSeeds},
  {
    name: ERootStackRoutes.SecretRecoveryPhraseTerm,
    component: SecretRecoveryPhraseTerm,
  },
  {
    name: ERootStackRoutes.SecretRecoveryPhrase,
    component: SecretRecoveryPhrase,
  },
  {
    name: ERootStackRoutes.VerifyRecoveryPhrase,
    component: VerifyRecoveryPhrase,
  },
];

export const APP_STACK_SCREENS = [
  {
    name: ERootStackRoutes.Home,
    component: Home,
  },
  {
    name: ERootStackRoutes.Networks,
    component: Networks,
  },
  {
    name: ERootStackRoutes.Send,
    component: Send,
  },
  {
    name: ERootStackRoutes.SendSummary,
    component: SendSummary,
  },
  {
    name: ERootStackRoutes.SendProgress,
    component: SendProgress,
  },
  {
    name: ERootStackRoutes.Contacts,
    component: Contacts,
  },
  {
    name: ERootStackRoutes.AddEditContact,
    component: AddEditContact,
  },
  {
    name: ERootStackRoutes.WalletConnectSettings,
    component: WalletConnectSettings,
  },
  {
    name: ERootStackRoutes.AddEditNetwork,
    component: AddEditNetwork,
  },
  {
    name: ERootStackRoutes.AddToken,
    component: AddToken,
  },
  {
    name: ERootStackRoutes.SearchTokens,
    component: SearchTokens,
  },
  {
    name: ERootStackRoutes.ImportAccount,
    component: ImportAccount,
  },
  {
    name: ERootStackRoutes.RecoverAccount,
    component: RecoverAccount,
  },
  {
    name: ERootStackRoutes.ExportRecoveryPhraseAuth,
    component: ExportRecoveryPhraseAuth,
  },
  {
    name: ERootStackRoutes.ExportRecoveryPhrase,
    component: ExportRecoveryPhrase,
  },
  {
    name: ERootStackRoutes.ResetPasscode,
    component: Login,
  },
  {
    name: ERootStackRoutes.ChangeAccountPassword,
    component: ChangeAccountPassword,
  },
  {
    name: ERootStackRoutes.WalletConnectScan,
    component: WalletConnectScan,
  },
  {
    name: ERootStackRoutes.SettingsSubPage,
    component: SettingsSubPage,
  },
  {
    name: ERootStackRoutes.ReceiverScan,
    component: ReceiverScan,
  },
];

export const HOME_TAB_SCREENS = [
  {
    name: EHomeTabRoutes.Wallet,
    component: Wallet,
    options: {
      tabBarLabel: 'Wallet',
      tabBarActiveTintColor: '#404A8D',
      tabBarInactiveTintColor: '#787B8E',
      tabBarIcon: ({focused}: any) => {
        if (focused) {
          return <LogoSvg width={24} height={24} />;
        }
        return <LogoGraySvg width={24} height={24} />;
      },
    },
  },
  {
    name: EHomeTabRoutes.Swap,
    component: Swap,
    options: {
      tabBarLabel: 'Convert',
      tabBarActiveTintColor: '#404A8D',
      tabBarInactiveTintColor: '#787B8E',
      tabBarIcon: ({focused}: any) => {
        return (
          <SwapSvg
            fill={focused ? '#404A8D' : '#787B8E'}
            width={24}
            height={24}
          />
        );
      },
    },
  },
  {
    name: EHomeTabRoutes.History,
    component: History,
    options: {
      tabBarLabel: 'History',
      tabBarActiveTintColor: '#404A8D',
      tabBarInactiveTintColor: '#787B8E',
      tabBarIcon: ({focused}: any) => {
        return (
          <TimeHistorySvg
            fill={focused ? '#404A8D' : '#787B8E'}
            width={24}
            height={24}
          />
        );
      },
    },
  },
  {
    name: EHomeTabRoutes.Connection,
    component: Connection,
    options: {
      tabBarLabel: 'Connections',
      tabBarActiveTintColor: '#404A8D',
      tabBarInactiveTintColor: '#787B8E',
      tabBarIcon: ({focused}: any) => {
        return (
          <ConnectionSvg
            fill={focused ? '#404A8D' : '#787B8E'}
            width={24}
            height={24}
          />
        );
      },
    },
  },
  {
    name: EHomeTabRoutes.Settings,
    component: Settings,
    options: {
      tabBarLabel: 'Settings',
      tabBarActiveTintColor: '#404A8D',
      tabBarInactiveTintColor: '#787B8E',
      tabBarIcon: ({focused}: any) => {
        return (
          <BasicSettingsSvg
            fill={focused ? '#404A8D' : '#787B8E'}
            width={24}
            height={24}
          />
        );
      },
    },
  },
];
