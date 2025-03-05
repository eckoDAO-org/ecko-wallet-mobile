import React from 'react';
import {View, Text} from 'react-native';

import {createStyles} from './styles';
import {useSafeAreaValues} from '../../../../utils/deviceHelpers';

const Header = React.memo(() => {
  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Transaction is in progress</Text>
    </View>
  );
});

export default Header;
