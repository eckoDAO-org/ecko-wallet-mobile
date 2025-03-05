import {StyleSheet} from 'react-native';
import {BOLD_MONTSERRAT, MEDIUM_MONTSERRAT} from '../../constants/styles';

export const createStyles = ({
  bottomSpace,
  statusBarHeight,
}: {
  bottomSpace: number;
  statusBarHeight: number;
}) =>
  StyleSheet.create({
    bgImage: {
      flex: 1,
      width: '100%',
    },
    header: {
      position: 'absolute',
      top: statusBarHeight + 12,
      left: 16,
      alignItems: 'flex-start',
      width: '100%',
      zIndex: 1,
    },
    contentWrapper: {
      flex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingTop: 96,
      width: '100%',
    },
    text: {
      fontFamily: MEDIUM_MONTSERRAT,
      fontSize: 24,
      fontWeight: '500',
      color: 'white',
      marginTop: 25,
      marginBottom: 51,
    },
    password: {
      width: '100%',
      paddingTop: 32,
    },
    confirmPassword: {
      width: '100%',
      paddingTop: 40,
      paddingBottom: 32,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    buttonContainer: {
      width: '100%',
      paddingBottom: bottomSpace + 16,
      backgroundColor: 'transparent',
    },
    button: {
      backgroundColor: '#FAA41A',
      width: '100%',
      paddingVertical: 17,
    },
    disabledBtn: {
      opacity: 0.5,
    },
    buttonText: {
      fontFamily: BOLD_MONTSERRAT,
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
      color: 'white',
    },
  });
