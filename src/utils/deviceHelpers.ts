import {AppState, Platform} from 'react-native';
import {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useAppState() {
  const [appState, setAppState] = useState<any>('active');

  useEffect(() => {
    function handleAppStateChange(nextAppState: any) {
      setAppState(nextAppState);
    }
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => appStateListener.remove();
  }, [appState]);

  return appState;
}

export const useSafeAreaValues = () => {
  const insets = useSafeAreaInsets();

  const bottomSpace = insets.bottom;
  const statusBarHeight =
    insets.top + (insets.top > 20 ? 8 : Platform.OS === 'android' ? 4 : 0);

  return {bottomSpace, statusBarHeight};
};
