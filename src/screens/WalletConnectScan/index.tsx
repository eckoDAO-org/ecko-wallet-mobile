import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';

import Header from './components/Header';
import {createStyles} from './styles';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import FooterButton from '../../components/FooterButton';
import {useNavigation} from '@react-navigation/native';
import {ERootStackRoutes, TNavigationProp} from '../../routes/types';
import {useWalletConnectContext} from '../../contexts';
import {useSafeAreaValues} from '../../utils/deviceHelpers';

const WalletConnectScan = () => {
  const navigation =
    useNavigation<TNavigationProp<ERootStackRoutes.WalletConnectScan>>();

  const {web3WalletClient} = useWalletConnectContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [textUri, setTexTUri] = useState<string>('');
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0]?.value && codes[0]?.value !== textUri) {
        setTexTUri(codes[0].value);
      }
    },
  });

  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

  const onProceed = useCallback(async () => {
    setIsLoading(true);
    if (textUri && web3WalletClient) {
      web3WalletClient?.core?.pairing?.pair({uri: textUri});
      setTimeout(() => {
        setIsLoading(false);
        navigation.goBack();
      }, 600);
    } else {
      setIsLoading(false);
    }
  }, [web3WalletClient, navigation, textUri]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const cameraView = useMemo(() => {
    return device != null && hasPermission ? (
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    ) : (
      <View style={styles.camera} />
    );
  }, [device, hasPermission]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={-bottomSpace}>
      <View style={styles.screen}>
        <Header />
        <TouchableOpacity
          activeOpacity={1}
          onPress={Keyboard.dismiss}
          style={styles.container}>
          {cameraView}
          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputSection}>
                <TextInput
                  style={styles.input}
                  autoFocus={false}
                  placeholder="Type connection code"
                  value={textUri}
                  onChangeText={setTexTUri}
                />
              </View>
            </View>
            <FooterButton
              style={styles.footerButton}
              title="Connect"
              disabled={!textUri || isLoading}
              onPress={onProceed}
            />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default WalletConnectScan;
