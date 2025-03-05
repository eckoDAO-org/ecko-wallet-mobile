import {StyleSheet} from 'react-native';
import {MEDIUM_MONTSERRAT} from '../../../../constants/styles';

export const createStyles = ({
  statusBarHeight,
}: {
  bottomSpace: number;
  statusBarHeight: number;
}) =>
  StyleSheet.create({
    header: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 12,
      marginTop: statusBarHeight,
    },
    title: {
      fontFamily: MEDIUM_MONTSERRAT,
      fontWeight: '500',
      fontSize: 18,
      color: 'black',
    },
  });
