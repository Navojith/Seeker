import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import InformationIcon from '../../../assets/icons/InformationIcon';
import DismissibleAlert from '../alerts/DismissibleAlert';

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
  infoMessage,
  infoViewStyles,
  infoButtonText,
  infoButtonTextStyle,
  infoContainerStyles,
  infoMessageStyles,
  loading,
  loadingText,
}) => {
  const [showInfoModal, setShowInfoModal] = useState({
    visibility: false,
    viewStyles: ` pt-8 flex justify-center border rounded-[42px] border-[6px] border-dark-blue ${infoViewStyles}`,
    message: infoMessage,
    buttonText: infoButtonText ?? 'Close',
    buttonContainerStyles: ` w-[100px] mx-auto rounded-full bg-dark-blue ${infoContainerStyles}`,
    buttonTextStyles: ` font-bold ${infoButtonTextStyle}`,
    messageStyles: ` text-2xl font-bold ${infoMessageStyles}`,
  });

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
              onPress={() =>
                setShowInfoModal({
                  ...showInfoModal,
                  visibility: true,
                })
              }
            >
              <InformationIcon />
            </TouchableOpacity>
          )}
          <DismissibleAlert data={showInfoModal} setData={setShowInfoModal} />
          <Text className={'text-3xl font-bold text-center my-8'}>
            {heading}
          </Text>
          {loading && (
            <Text
              className={'text-lg font-bold text-center mb-8 text-light-blue'}
            >
              {loadingText}
            </Text>
          )}
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
