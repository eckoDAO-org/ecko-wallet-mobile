import React, {useCallback, useMemo} from 'react';
import {ScrollView, View, Text} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';

import Header from './components/Header';
import Warning from '../../components/Warning';
import ListItem from '../../components/ListItem';
import BasicCopySvg from '../../assets/images/basic-copy.svg';
import {createStyles} from './styles';
import {makeSelectGeneratedPhrases} from '../../store/auth/selectors';
import {getSecretList} from '../../utils/stringHelpers';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useShallowEqualSelector} from '../../store/utils';
import {useSafeAreaValues} from '../../utils/deviceHelpers';

const ExportRecoveryPhrase = () => {
  const seeds = useShallowEqualSelector(makeSelectGeneratedPhrases);

  const secretWords = useMemo(() => getSecretList(seeds), [seeds]);
  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

  const copyToClipboard = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
    Clipboard.setString(seeds);
    Snackbar.show({
      text: 'Recovery secret phrase copied to clipboard!',
      duration: Snackbar.LENGTH_SHORT,
    });
  }, [seeds]);

  return (
    <View style={styles.screen}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.contentWrapper}>
        <View style={styles.cardContainer}>
          <View style={styles.secretKeysWrapper}>
            {secretWords.map((word, j) => (
              <View key={word + j} style={styles.secretKeysText}>
                {word.split(' ').map((item, index) => (
                  <Text key={index + j} style={styles.secretKeys}>
                    {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.text}>
            Your Secret Recovery Phrase makes it easy to back up and restore
            your account.
          </Text>
          <Warning text="Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your wallet forever." />
        </View>
        <View style={styles.footerWrapper}>
          <ListItem
            onPress={copyToClipboard}
            textStyle={styles.itemText}
            style={styles.itemStyle}
            text="Copy Recovery Phrase"
            icon={<BasicCopySvg />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ExportRecoveryPhrase;
