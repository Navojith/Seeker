import { View, Text } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import MainButton from '../buttons/MainButton';
import InformationIcon from '../../../assets/icons/InformationIcon';

const TwoButtonModal = ({
  isVisible,
  setIsVisible,
  heading,
  modalStyles,
  onPressConfirm,
  onPressCancel,
  confirmContainerStyles,
  confirmTextStyles,
  cancelContainerStyles,
  cancelTextStyles,
  confirmText,
  cancelText,
}) => {
  return (
    <Modal isVisible={isVisible}>
      <View className={`flex flex-col w-[300px] ${modalStyles}`}>
        <InformationIcon className="absolute mt-0 mr-0" />
        <Text>{heading}</Text>
        <MainButton
          text={confirmText ?? 'Yes'}
          onPress={onPressConfirm}
          containerStyles={confirmContainerStyles}
          textStyles={confirmTextStyles}
        />
        <MainButton
          text={cancelText ?? 'No'}
          onPress={onPressCancel}
          containerStyles={cancelContainerStyles}
          textStyles={cancelTextStyles}
        />
      </View>
    </Modal>
  );
};

export default TwoButtonModal;
