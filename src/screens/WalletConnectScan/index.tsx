import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Header from './components/Header';
import {styles} from './styles';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import FooterButton from '../../components/FooterButton';
import {bottomSpace} from '../../utils/deviceHelpers';
import {useNavigation} from '@react-navigation/native';
import {ERootStackRoutes, TNavigationProp} from '../../routes/types';
import {useWalletConnectContext} from '../../contexts';

const WalletConnectScan = () => {
  const navigation =
    useNavigation<TNavigationProp<ERootStackRoutes.WalletConnectScan>>();

  const {web3WalletClient} = useWalletConnectContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [textUri, setTexTUri] = useState<string>('');
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    if (
      barcodes &&
      Array.isArray(barcodes) &&
      barcodes.length > 0 &&
      barcodes[0].rawValue
    ) {
      if (!textUri || textUri !== barcodes[0].rawValue) {
        setTexTUri(barcodes[0].rawValue);
      }
    }
  }, [navigation, barcodes, textUri]);

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
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const cameraView = useMemo(() => {
    return device != null && hasPermission ? (
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
    ) : (
      <View style={styles.camera} />
    );
  }, [device, hasPermission]);

  return (
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
          {Platform.OS === 'ios' && (
            <KeyboardSpacer topSpacing={-bottomSpace} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default WalletConnectScan;
