import { DrawerHeaderProps } from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import Style from '../../../commons/Style';
import { ScreenName } from '../../../routes/screens.enum';
import { Container, Row, Title } from './styles';

const HeaderWithGoBack: React.FC<DrawerHeaderProps> = props => {
  return (
    <Container>
      <Row>
        <Title>{props.options.headerTitle || props.route.name}</Title>

        <TouchableOpacity
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: ScreenName.InitialPage }],
            });
          }}>
          <Icon name="close" size={38} color={Style.mainColor} />
        </TouchableOpacity>
      </Row>
    </Container>
  );
};

export default HeaderWithGoBack;
