import React, {FC, useCallback, useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import BasicSettingsSvg from '../../../../assets/images/basic-settins.svg';
import {TouchableOpacity} from 'react-native';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import {styles} from './styles';

import Predicate from '../../../../components/Predicate';
import {predicates} from '../../consts';
import {TSettingsType} from './types';
import {useSafeAreaValues} from '../../../../utils/deviceHelpers';

const Settings: FC<TSettingsType> = ({
  predicate,
  setPredicate,
  receiverPublicKey,
  setReceiverPublicKey,
}) => {
  const [isVisible, setVisible] = useState(false);
  const {bottomSpace} = useSafeAreaValues();

  const toggleModal = useCallback(() => {
    setVisible(!isVisible);
  }, [isVisible]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.iconWrapper}
        onPress={toggleModal}>
        <BasicSettingsSvg fill="#787B8E" width={24} height={24} />
      </TouchableOpacity>
      <Modal
        isVisible={isVisible}
        close={toggleModal}
        title="Advanced Settings">
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={-bottomSpace}>
          <View style={styles.contentWrapper}>
            <View style={styles.predicateContainer}>
              <Predicate
                value={predicate}
                setValue={setPredicate}
                items={predicates}
              />
            </View>
            <Input
              wrapperStyle={styles.inputWrapper}
              label="Receiver Public Key"
              placeholder="Enter Public Key (Optional)"
              value={receiverPublicKey || ''}
              onChangeText={setReceiverPublicKey}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default Settings;
