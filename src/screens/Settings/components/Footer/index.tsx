import React, {FC} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import packageJson from '../../../../../package.json';
import GlobeSvg from '../../../../assets/images/globe.svg';
import {styles} from './styles';

const Footer: FC = React.memo(() => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{`eckoWALLET ${packageJson.version}`}</Text>
      <Text style={styles.text}>The Kadena ecosystem gateway</Text>
      <View style={styles.tipsWrapper}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://dex.ecko.finance/')}
          activeOpacity={0.8}
          style={styles.tip}>
          <GlobeSvg width="24" height="24" />
          <Text style={styles.tipTitle}>Visit our website</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://wallet.ecko.finance/terms-of-use')
          }
          activeOpacity={0.8}
          style={styles.tip}>
          <Text style={styles.tipTitleNoIcon}>Terms of use</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://wallet.ecko.finance/privacy-policy')
          }
          activeOpacity={0.8}
          style={styles.tip}>
          <Text style={styles.tipTitleNoIcon}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default Footer;
