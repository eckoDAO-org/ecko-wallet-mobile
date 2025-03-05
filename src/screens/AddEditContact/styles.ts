import {StyleSheet} from 'react-native';

export const createStyles = ({
  bottomSpace,
  statusBarHeight,
}: {
  bottomSpace: number;
  statusBarHeight: number;
}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      width: '100%',
      paddingTop: statusBarHeight,
    },
    contentWrapper: {
      flex: 1,
      width: '100%',
    },
    content: {
      width: '100%',
      paddingTop: 24,
      paddingHorizontal: 20,
    },
    inputWrapper: {
      marginBottom: 24,
    },
    accountNameInput: {
      height: 103,
    },
    footer: {
      marginBottom: bottomSpace + 24,
      width: '100%',
    },
  });
