import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerNavigationState, ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import Style from '../../../commons/Style';
import { TIP_USUARIOS_DESCRIPTIONS } from '../../enum';
import { Styled } from '../../utils/LayoutUtils/BaseStyle';
import { IRootState } from '../../../store';
import { logOut } from '../../../store/modules/auth/authSlice';
import { AuthState } from '../../@types/auth/types';
import { ButtonOutline } from '../commons/Button';
import { Text } from '../commons/Text';
import { DrawerItem } from './styles';

declare type Props = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

const ReDrawer: React.FC<Props> = props => {
  const dispatch = useDispatch();

  const { user } = useSelector<IRootState, AuthState>(state => state.auth);

  const screens = Object.values(props.descriptors);
  const appScreens = screens.filter(x => x.route.name.includes('app.'));
  const manutScreens = screens.filter(x => x.route.name.includes('manut.'));
  const confScreens = screens.filter(x => x.route.name.includes('conf.'));

  const key = screens[props.state.index].route.key || '';

  return (
    <View style={{ flex: 1 }}>
      <Styled
        sm="flex-direction: column; padding: 50px 0px 35px 0px;"
        lg="flex-direction: row; padding: 20px 0px 0px 25px;"
        alignItems="center"
        backgroundColor={Style.theme.mainColor}
        css="border-bottom-right-radius: 30; elevation: 10;">
        {/* Icon */}
        <Styled
          type="row"
          alignItems="center"
          justifyContent="center"
          css="padding: 10px; border-radius: 1000px; height: 50px; width: 50px;"
          backgroundColor={Style.theme.primary}>
          <Icon name="user" color={Style.cleanColorLighter} size={30} />
        </Styled>

        {/* Texts */}
        <Styled>
          <Styled type="container" sm="align-items: center;" css="">
            <Text
              size="md"
              textColor={Style.cleanColorLighter}
              fontWeight="700">
              Olá, {user?.nome}!
            </Text>
            <Text variance="darkenSecondary" fontWeight="500" marginTop={-5}>
              {TIP_USUARIOS_DESCRIPTIONS[user?.tipUsuario || 0]}
            </Text>
          </Styled>
        </Styled>
      </Styled>

      <ScrollView {...props}>
        <Text
          fontSize={10}
          fontWeight="bold"
          variance="darkenSecondary"
          marginLeft={15}
          marginBottom={15}
          marginTop={25}>
          APP
        </Text>

        {appScreens.map((x, index) => (
          <DrawerItem
            key={index}
            active={key === x.route.key}
            onPress={() => props.navigation.navigate(x.route.name)}>
            <Text
              textColor={
                key === x.route.key ? 'white' : Style.theme.darkenSecondary
              }
              fontWeight="600">
              {x.options.drawerLabel?.toString() || x.route.name}
            </Text>
          </DrawerItem>
        ))}

        <Text
          fontSize={10}
          fontWeight="bold"
          variance="darkenSecondary"
          marginLeft={15}
          marginBottom={15}
          marginTop={25}>
          Manutenção
        </Text>

        {manutScreens.map((x, index) => (
          <DrawerItem
            key={index}
            active={key === x.route.key}
            onPress={() => props.navigation.navigate(x.route.name)}>
            <Text
              textColor={
                key === x.route.key ? 'white' : Style.theme.darkenSecondary
              }
              fontWeight="600">
              {x.options.drawerLabel?.toString() || x.route.name}
            </Text>
          </DrawerItem>
        ))}

        <Text
          fontSize={10}
          fontWeight="bold"
          variance="darkenSecondary"
          marginLeft={15}
          marginBottom={15}
          marginTop={10}>
          Configurações
        </Text>
        {confScreens.map((x, index) => (
          <Drawer.Item
            key={index}
            label={x.options.drawerLabel?.toString() || x.route.name}
            active={key === x.route.key}
            onPress={() => props.navigation.navigate(x.route.name)}
          />
        ))}
      </ScrollView>

      <ButtonOutline
        marginBottom={10}
        marginLeft={10}
        marginRight={10}
        title="Logout"
        variance={'primary'}
        size={'md'}
        leftIcon={
          <Icon name="sign-out" size={25} color={Style.theme.mainColor} />
        }
        onPress={() => dispatch(logOut())}
      />
    </View>
  );
};

export default ReDrawer;
