import React, {useCallback, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, Controller, FieldValues} from 'react-hook-form';

import Logo from '../../assets/images/logo.svg';
import ArrowLeftSvg from '../../assets/images/arrow-left.svg';

import {createStyles} from './styles';
import {ERootStackRoutes, TNavigationProp} from '../../routes/types';
import {changePassword} from '../../store/auth';
import {makeSelectHasAccount} from '../../store/userWallet/selectors';
import PasswordInput from '../../components/PasswordInput';
import {createPasswordSchema} from '../../validation/createPasswordSchema';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useNavigation} from '@react-navigation/native';
import {hashPassword} from '../../api/kadena/hashPassword';
import {useSafeAreaValues} from '../../utils/deviceHelpers';

const bgImage = require('../../assets/images/bgimage.png');

const Registration = () => {
  const navigation =
    useNavigation<TNavigationProp<ERootStackRoutes.Registration>>();
  const dispatch = useDispatch();
  const hasAccount = useSelector(makeSelectHasAccount);

  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({resolver: createPasswordSchema, mode: 'onChange'});

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressCreate = useCallback(
    (data: FieldValues) => {
      if (hasAccount) {
        return;
      }

      hashPassword({
        password: data.password || '',
      })
        .then(hashResponseHash => {
          if (hashResponseHash) {
            dispatch(changePassword(hashResponseHash));
            navigation.navigate({
              name: ERootStackRoutes.SecretRecoveryPhraseTerm,
              params: undefined,
            });
          } else {
            ReactNativeHapticFeedback.trigger('impactMedium', {
              enableVibrateFallback: false,
              ignoreAndroidSystemSettings: false,
            });
            Alert.alert(
              'Failed to register',
              'Something went wrong. Please try again later.',
            );
          }
        })
        .catch(() => {
          ReactNativeHapticFeedback.trigger('impactMedium', {
            enableVibrateFallback: false,
            ignoreAndroidSystemSettings: false,
          });
          Alert.alert(
            'Failed to register',
            'Something went wrong. Please try again later.',
          );
        });
    },
    [hasAccount],
  );

  const scrollRef = useRef<ScrollView | null>(null);

  if (hasAccount) {
    navigation.replace(ERootStackRoutes.SignIn);
    return null;
  }

  return (
    <ImageBackground source={bgImage} resizeMode="cover" style={styles.bgImage}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={-bottomSpace}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.contentWrapper}
          contentContainerStyle={styles.content}>
          <Logo width={50} height={50} />
          <Text style={styles.text}>Create Password</Text>
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <PasswordInput
                wrapperStyle={styles.password}
                autoFocus={true}
                label="New Password"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                blurOnSubmit={true}
                errorMessage={errors.password?.message as string}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, onBlur, value}}) => (
              <PasswordInput
                wrapperStyle={styles.confirmPassword}
                label="Confirm Password"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                blurOnSubmit={true}
                errorMessage={errors.confirmPassword?.message as string}
                onSubmitEditing={handleSubmit(handlePressCreate)}
              />
            )}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isValid}
            style={[styles.button, !isValid && styles.disabledBtn]}
            onPress={handleSubmit(handlePressCreate)}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={handlePressBack}>
            <ArrowLeftSvg fill="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Registration;
