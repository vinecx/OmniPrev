import {
  useNavigation,
  useRoute,
  useNavigationState,
} from '@react-navigation/native';
import Style from '../../../commons/Style';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';

// import { Container } from './styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ButtonContainer = styled.TouchableOpacity`
  padding: 5px 15px;
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'contain',
})`
  margin-left: 10px;
  margin-right: -5px;
  height: 40px;
  width: 40px;
`;

interface HeaderButtonDrawerProps {
  hideLogo?: true;
}
const HeaderButtonDrawer: React.FC<HeaderButtonDrawerProps> = ({
  hideLogo,
}) => {
  const navigation = useNavigation();

  const route = useRoute();
  return (
    <Container>
      <ButtonContainer
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation?.openDrawer();
          }
        }}>
        {navigation.canGoBack() ? (
          <Icon
            name="arrowleft"
            size={25}
            color={Style.theme.lighterSecondary}
          />
        ) : (
          <Icon
            name="menu-fold"
            size={25}
            color={Style.theme.lighterSecondary}
          />
        )}
      </ButtonContainer>

      {!hideLogo}
    </Container>
  );
};

export default HeaderButtonDrawer;
