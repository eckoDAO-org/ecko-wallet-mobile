import {StyleSheet} from 'react-native';

export const createStyles = ({
  bottomSpace,
  statusBarHeight,
}: {
  bottomSpace: number;
  statusBarHeight: number;
}) =>
  StyleSheet.create({
    container: {
      marginTop: statusBarHeight,
      flex: 1,
    },
    body: {
      flex: 1,
    },
    contactsWrapper: {
      flex: 1,
    },
    contactsContent: {
      paddingTop: 18,
      paddingHorizontal: 24,
    },
  });
