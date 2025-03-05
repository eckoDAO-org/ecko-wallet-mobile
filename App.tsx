import React, {useCallback, useEffect, useMemo} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Provider, useSelector} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import {PactProvider} from './src/contexts/Pact';
import AppStack from './src/navigation/AppStack';
import {makeSelectIsAuthorized} from './src/store/auth/selectors';
import {persistor, store} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import LogoSvg from './src/assets/images/logo.svg';
import JailMonkey from 'jail-monkey';
import {WalletConnectProvider} from './src/contexts/WalletConnect';
import {useWalletConnect} from './src/utils/walletConnect';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const isAuthorized = useSelector(makeSelectIsAuthorized);

  const onReady = useCallback(() => {
    RNBootSplash.hide({fade: true});
  }, []);

  const statusBarStyle = useMemo(
    () =>
      Platform.OS === 'ios'
        ? !isAuthorized
          ? 'light-content'
          : 'dark-content'
        : 'light-content',
    [isAuthorized],
  );

  const statusBarColor = useMemo(
    () => (Platform.OS === 'ios' ? 'transparent' : 'black'),
    [],
  );

  const appTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: isAuthorized ? '#f9f9fe' : 'black',
      },
    }),
    [isAuthorized],
  );

  useEffect(() => {
    if (JailMonkey.isJailBroken()) {
      RNBootSplash.hide({fade: true});
      Alert.alert(
        'Device is rooted',
        'Jail-broken or rooted devices can not use eckoWALLET',
        undefined,
        {cancelable: false},
      );
    }
  }, []);

  const walletConnectModal = useWalletConnect();

  if (JailMonkey.isJailBroken()) {
    return (
      <>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarColor}
          translucent={true}
        />
        <SafeAreaView style={styles.screen}>
          <LogoSvg />
        </SafeAreaView>
      </>
    );
  }
  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor}
        translucent={false}
      />
      <NavigationContainer onReady={onReady} theme={appTheme}>
        <AppStack />
      </NavigationContainer>
      {walletConnectModal}
      <Toast />
    </>
  );
};

const AppContainer = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PactProvider>
          <WalletConnectProvider>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </WalletConnectProvider>
        </PactProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});

export default AppContainer;
