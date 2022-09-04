import React from 'react';
import { Text, Title } from '../../shared/components/commons/Text';
import { Styled } from '../../shared/utils/LayoutUtils/BaseStyle';

const Main: React.FC = () => {
  return (
    <Styled css="padding: 30px;">
      <Title variance="primary">Bem vindo ao OmniPrev</Title>
      <Text variance="darkenSecondary" size="md" fontWeight="300">
        Acesse o menu lateral para acessar as demais funcionalidades!
      </Text>
    </Styled>
  );
};

export default Main;
