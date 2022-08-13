import React from 'react';
import { View } from 'react-native';
import {
  Divider,
  Modal as ModalPaper,
  Portal,
  Subheading,
  Title,
} from 'react-native-paper';

interface IModalProps {
  show: boolean;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  onDismiss: () => void;
}
const Modal: React.FC<IModalProps> = ({
  show,
  message,
  title,
  onDismiss,
  children,
}) => {
  return (
    <Portal>
      <ModalPaper
        visible={show}
        onDismiss={onDismiss}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        contentContainerStyle={{
          display: 'flex',
          justifyContent: 'center',
          width: '90%',
          alignItems: 'center',
          borderRadius: 35,
          backgroundColor: 'white',
          padding: 30,
          elevation: 25,
        }}>
        <View>
          <Title style={{ fontSize: 30, marginVertical: 15 }}>{title}</Title>
          <Divider />
          <Subheading style={{ marginBottom: 15 }}>{message}</Subheading>

          {children}
        </View>
      </ModalPaper>
    </Portal>
  );
};

export default Modal;
