import React, {useCallback, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {useForm, Controller, FieldValues} from 'react-hook-form';

import Header from './components/Header';
import SecurityUnlockSvg from '../../assets/images/security-unlock.svg';
import PasswordInput from '../../components/PasswordInput';
import {exportRecoveryPhraseSchema} from '../../validation/exportRecoveryPhraseSchema';
import {createStyles} from './styles';
import {ERootStackRoutes, TNavigationProp} from '../../routes/types';
import {useScrollBottomOnKeyboard} from '../../utils/keyboardHelpers';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {makeSelectHashPassword} from '../../store/auth/selectors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {comparePassword} from '../../api/kadena/comparePassword';
import {useSafeAreaValues} from '../../utils/deviceHelpers';

const ExportRecoveryPhraseAuth = () => {
  const navigation =
    useNavigation<TNavigationProp<ERootStackRoutes.ExportRecoveryPhraseAuth>>();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: exportRecoveryPhraseSchema,
  });

  const hash = useSelector(makeSelectHashPassword);

  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

  const handlePressContinue = useCallback(
    (data: FieldValues) => {
      comparePassword({
        password: data.password || '',
        hash: hash || '',
      })
        .then(compareResponse => {
          if (compareResponse) {
            navigation.replace(
              ERootStackRoutes.ExportRecoveryPhrase,
              {} as any,
            );
          } else {
            ReactNativeHapticFeedback.trigger('impactMedium', {
              enableVibrateFallback: false,
              ignoreAndroidSystemSettings: false,
            });
            Alert.alert('Failed to verify', 'Invalid password');
          }
        })
        .catch(() => {
          ReactNativeHapticFeedback.trigger('impactMedium', {
            enableVibrateFallback: false,
            ignoreAndroidSystemSettings: false,
          });
          Alert.alert(
            'Failed to verify',
            'Something went wrong. Please try again later.',
          );
        });
    },
    [navigation, hash],
  );

  const scrollRef = useRef<ScrollView | null>(null);
  useScrollBottomOnKeyboard(scrollRef);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={-bottomSpace}>
      <View style={styles.screen}>
        <Header />
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.contentWrapper}
          contentContainerStyle={styles.content}>
          <SecurityUnlockSvg fill="#787B8E" />
          <Text style={styles.text}>Enter your password to continue</Text>
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <PasswordInput
                wrapperStyle={styles.passwordWrapper}
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                blurOnSubmit={true}
                errorMessage={errors.password?.message as string}
                autoFocus={true}
                onSubmitEditing={handleSubmit(handlePressContinue)}
              />
            )}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={handleSubmit(handlePressContinue)}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ExportRecoveryPhraseAuth;
