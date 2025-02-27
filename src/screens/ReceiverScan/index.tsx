import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Header from './components/Header';
import {createStyles} from './styles';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import FooterButton from '../../components/FooterButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  ERootStackRoutes,
  TNavigationProp,
  TNavigationRouteProp,
} from '../../routes/types';
import {useSafeAreaValues} from '../../utils/deviceHelpers';

const ReceiverScan = () => {
  const navigation =
    useNavigation<TNavigationProp<ERootStackRoutes.ReceiverScan>>();
  const route = useRoute<TNavigationRouteProp<ERootStackRoutes.ReceiverScan>>();

  const [hasPermission, setHasPermission] = useState(false);
  const [textUri, setTexTUri] = useState<string>('');

  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0]?.value && codes[0]?.value !== textUri) {
        ReactNativeHapticFeedback.trigger('impactMedium', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: true,
        });
        setTexTUri(codes[0].value);
      }
    },
  });

  const onProceed = useCallback(async () => {
    if (textUri && route?.params?.onScan) {
      route?.params?.onScan(textUri);
      navigation.goBack();
    }
  }, [navigation, textUri, route?.params]);

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
                  placeholder="Edit destination account"
                  value={textUri}
                  onChangeText={setTexTUri}
                />
              </View>
            </View>
            <FooterButton
              style={styles.footerButton}
              title="Confirm"
              disabled={!textUri}
              onPress={onProceed}
            />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReceiverScan;
