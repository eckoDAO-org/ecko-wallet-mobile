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
import {useForm, Controller, FieldValues} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';

import Logo from '../../assets/images/logo.svg';
import ArrowLeftSvg from '../../assets/images/arrow-left.svg';

import {createStyles} from './styles';
import PasswordInput from '../../components/PasswordInput';
import {signInPasswordSchema} from '../../validation/signInPasswordSchema';
import {login} from '../../store/auth';
import {makeSelectHashPassword} from '../../store/auth/selectors';
import {ERootStackRoutes, TNavigationProp} from '../../routes/types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useNavigation} from '@react-navigation/native';
import {comparePassword} from '../../api/kadena/comparePassword';
import {useSafeAreaValues} from '../../utils/deviceHelpers';

const bgImage = require('../../assets/images/bgimage.png');

const SignIn = () => {
  const navigation = useNavigation<TNavigationProp<ERootStackRoutes.SignIn>>();

  const dispatch = useDispatch();

  const hash = useSelector(makeSelectHashPassword);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({resolver: signInPasswordSchema});

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const showSuccessAlert = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
    Alert.alert(
      'Use passcode Login to sign in?',
      'Would you like to use passcode and biometrics to access eckoWALLET?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            dispatch(login());
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate({
              name: ERootStackRoutes.Login,
              params: {
                isReset: false,
              },
            });
          },
        },
      ],
    );
  }, [navigation]);

  const handlePressSignIn = useCallback(
    (data: FieldValues) => {
      comparePassword({
        password: data.password || '',
        hash: hash || '',
      })
        .then(compareResponse => {
          if (compareResponse) {
            showSuccessAlert();
          } else {
            ReactNativeHapticFeedback.trigger('impactMedium', {
              enableVibrateFallback: false,
              ignoreAndroidSystemSettings: false,
            });
            Alert.alert('Failed to login', 'Invalid password');
          }
        })
        .catch(() => {
          ReactNativeHapticFeedback.trigger('impactMedium', {
            enableVibrateFallback: false,
            ignoreAndroidSystemSettings: false,
          });
          Alert.alert(
            'Failed to login',
            'Something went wrong. Please try again later.',
          );
        });
    },
    [showSuccessAlert, hash],
  );

  const scrollRef = useRef<ScrollView | null>(null);
  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

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
          <Text style={styles.text}>Welcome</Text>
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <PasswordInput
                autoFocus={true}
                label="Password"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                wrapperStyle={styles.password}
                errorMessage={errors.password?.message as string}
                onSubmitEditing={handleSubmit(handlePressSignIn)}
              />
            )}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={handleSubmit(handlePressSignIn)}>
            <Text style={styles.buttonText}>Sign in</Text>
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

export default SignIn;
