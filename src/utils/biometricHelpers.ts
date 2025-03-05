import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
const rnBiometrics = new ReactNativeBiometrics();

export const getAvailableSensor = () => {
  return rnBiometrics.isSensorAvailable().then(resultObject => {
    const {available, biometryType} = resultObject;
    if (
      available &&
      (biometryType === BiometryTypes.TouchID ||
        biometryType === BiometryTypes.FaceID ||
        biometryType === BiometryTypes.Biometrics)
    ) {
      return biometryType;
    } else {
      return null;
    }
  });
};

export const keyExist = () => {
  return rnBiometrics
    .biometricKeysExist()
    .then(resultObject => {
      const {keysExist} = resultObject;
      return keysExist;
    })
    .catch(() => Promise.reject());
};

export const createKeys = () => {
  return rnBiometrics
    .createKeys()
    .then(resultObject => {
      const {publicKey} = resultObject;
      return publicKey;
    })
    .catch(() => Promise.reject());
};
