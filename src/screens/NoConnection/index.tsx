import React, {FC, useEffect} from 'react';
import {View, Text, ImageBackground} from 'react-native';

import {createStyles} from './styles';
import {TLoginProps} from './types';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSafeAreaValues} from '../../utils/deviceHelpers';

const bgImage = require('../../assets/images/bgimage.png');

const NoConnection: FC<TLoginProps> = ({navigation}) => {
  const netInfo = useNetInfo();

  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

  useEffect(() => {
    if (netInfo?.isInternetReachable && netInfo?.isConnected) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, []);
  return (
    <ImageBackground source={bgImage} resizeMode="cover" style={styles.bgImage}>
      <View style={styles.contentWrapper}>
        <Text style={styles.unlockText}>No Network Connection</Text>
      </View>
    </ImageBackground>
  );
};

export default NoConnection;
