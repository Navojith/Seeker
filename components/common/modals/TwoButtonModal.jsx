import { View, Text, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
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
  showInfoIcon,
  onPressInfo,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 30,
            borderRadius: 42,
            borderWidth: 6,
            borderColor: '#0369A1',
          }}
          className={modalStyles ?? ''}
        >
          {showInfoIcon !== false && (
            <TouchableOpacity
              className="absolute top-4 right-3 box-shadow-xl"
              onPress={onPressInfo}
            >
              <InformationIcon />
            </TouchableOpacity>
          )}
          <Text className={'text-3xl font-bold text-center my-8'}>
            {heading}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity onPress={onPressConfirm}>
              <View
                className={`w-[100px] rounded-full bg-dark-blue ${confirmContainerStyles}`}
                style={{
                  elevation: 5, // Add this line to create a drop shadow
                  shadowColor: '#000', // Shadow color
                  shadowOpacity: 0.5,
                  shadowRadius: 1.84,
                  paddingVertical: 4,
                }}
              >
                <Text
                  className={`text-center font-bold text-white text-2xl ${confirmTextStyles}`}
                >
                  {confirmText ?? 'Yes'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={
                onPressCancel !== undefined
                  ? () => onPressCancel(setIsVisible)
                  : () => setIsVisible(false)
              }
            >
              <View
                className={`w-[100px] rounded-full bg-dark-blue ${cancelContainerStyles}`}
                style={{
                  elevation: 5, // Add this line to create a drop shadow
                  shadowColor: '#000', // Shadow color
                  shadowOpacity: 0.5,
                  shadowRadius: 1.84,
                  paddingVertical: 4,
                }}
              >
                <Text
                  className={`text-center font-bold text-white text-2xl ${cancelTextStyles}`}
                >
                  {cancelText ?? 'No'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TwoButtonModal;
