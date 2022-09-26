import React from 'react';
import { Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '../../../../shared/components/commons/Button';
import { Title } from '../../../../shared/components/commons/Text';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

interface IModalLocaisProps {
  openModal: boolean;
  handleCloseModal: () => void;
  onAddClick: () => void;
}

const ModalLocais: React.FC<IModalLocaisProps> = ({
  openModal,
  handleCloseModal,
  onAddClick,
  children,
}) => {
  return (
    <Modal visible={openModal}>
      <Styled flex={1} css="padding: 10px 15px;">
        <ScrollView>{children}</ScrollView>
        <Styled>
          <Styled type="row" css=" width: 100%;">
            <Button
              title="Voltar"
              size="md"
              flex={1}
              variance="secondary"
              marginRight={10}
              onPress={() => handleCloseModal()}
            />
            <Button
              title="Adicionar"
              size="md"
              width="70%"
              variance="primary"
              onPress={onAddClick}
            />
          </Styled>
        </Styled>
      </Styled>
    </Modal>
  );
};

export default ModalLocais;
