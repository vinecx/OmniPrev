import React, { useState } from 'react';
import { Button as ButtonPaper } from 'react-native-paper';
import Modal from '../../shared/components/Modal';
// Components
import { Container } from './styles';

const Main: React.FC = () => {
  const [modalState, setModalState] = useState<{
    show: boolean;
    title?: string;
    message?: string;
  }>({
    show: false,
  });

  const hideModal = () => {
    setModalState({ show: false });
  };

  return (
    <Container>
      <Modal
        show={modalState.show}
        title={modalState.title || ''}
        message={modalState.message || ''}
        type="success"
        onDismiss={hideModal}>
        <ButtonPaper onPress={hideModal} mode="contained">
          OK
        </ButtonPaper>
      </Modal>
    </Container>
  );
};

export default Main;
