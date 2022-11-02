import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerNavigationState, ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import Image from '../../../assets/images/header.jpeg';
import Style from '../../../commons/Style';
import { hasPermissionToAcess, ScreenName } from '../../../routes/screens.enum';
import RenderIf from '../../../shared/utils/RenderIf';
import { IRootState } from '../../../store';
import { logOut, selectClient } from '../../../store/modules/auth/authSlice';
import { AuthState } from '../../@types/auth/types';
import { TIP_USUARIOS_DESCRIPTIONS } from '../../enum';
import { Styled } from '../../utils/LayoutUtils/BaseStyle';
import { Button } from '../commons/Button';
import { Text } from '../commons/Text';
import { DrawerItem } from './styles';

declare type Props = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

const SidebarDrawer: React.FC<Props> = props => {
  const dispatch = useDispatch();

  const { user, clienteLogado } = useSelector<IRootState, AuthState>(
    state => state.auth,
  );

  const screens = Object.values(props.descriptors);

  const appScreens = screens.filter(
    x =>
      x.route.name.startsWith('app.') &&
      hasPermissionToAcess(x.route.name as ScreenName, user?.tipUsuario),
  );
  const manutScreens = screens.filter(
    x =>
      x.route.name.startsWith('manut.') &&
      hasPermissionToAcess(x.route.name as ScreenName, user?.tipUsuario),
  );
  const planManutScreens = screens.filter(
    x =>
      x.route.name.startsWith('plan_manut.') &&
      hasPermissionToAcess(x.route.name as ScreenName, user?.tipUsuario),
  );
  const confScreens = screens.filter(
    x =>
      x.route.name.startsWith('conf.') &&
      hasPermissionToAcess(x.route.name as ScreenName, user?.tipUsuario),
  );

  const hasAppScreens = appScreens.length > 0;
  const hasManutScreens = manutScreens.length > 0;
  const hasPlanManutScreens = planManutScreens.length > 0;
  const hasConfScreens = confScreens.length > 0;

  const key = screens[props.state.index].route.key || '';

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={Image}
        resizeMode="cover"
        style={styles.image}
        imageStyle={{
          opacity: 0.7,
          borderBottomRightRadius: 30,
        }}>
        <Styled
          sm="flex-direction: column; padding: 40px 0px 15px 0px;"
          lg="flex-direction: row; padding: 20px 0px 0px 25px;"
          alignItems="center"
          css="border-bottom-right-radius: 30; margin: 0;">
          {/* Icon */}
          <Styled
            type="row"
            alignItems="center"
            justifyContent="center"
            css="padding: 10px; border-radius: 1000px; height: 50px; width: 50px; elevation: 10"
            backgroundColor={Style.theme.darkenPrimary}>
            <Icon name="user" color={Style.theme.lighterSecondary} size={30} />
          </Styled>

          {/* Texts */}
          <Styled>
            <Styled type="container" sm="align-items: center;" css="">
              <Text
                size="md"
                textColor={Style.cleanColorLighter}
                fontWeight="bold">
                Olá, {user?.nome}!
              </Text>
              <Text
                textColor={Style.theme.darkenPrimary}
                fontWeight="700"
                backgroundColor={Style.theme.secondary[99]}
                paddingBottom={2}
                paddingTop={2}
                paddingLeft={10}
                paddingRight={10}
                borderRadius={15}>
                {TIP_USUARIOS_DESCRIPTIONS[user?.tipUsuario || 0]}
              </Text>
            </Styled>
          </Styled>
        </Styled>
      </ImageBackground>

      <ScrollView {...props}>
        {/* App screens */}
        <RenderIf condition={hasAppScreens}>
          <Text
            fontSize={12}
            fontWeight="600"
            textColor={Style.fontColorLightGrey}
            marginTop={30}
            marginLeft={25}
            marginBottom={5}>
            Início
          </Text>

          {appScreens.map((x, index) => (
            <DrawerItem
              key={index}
              active={key === x.route.key}
              onPress={() => props.navigation.navigate(x.route.name)}>
              <Text
                textColor={
                  key === x.route.key ? 'white' : Style.theme.mainColor
                }
                fontWeight="600">
                {x.options.drawerLabel?.toString() || x.route.name}
              </Text>
            </DrawerItem>
          ))}
        </RenderIf>

        {/* Plano de Manutenção screens */}
        <RenderIf condition={hasPlanManutScreens}>
          <Divider
            style={{
              height: 1,
              backgroundColor: Style.theme.lighterSecondary,
              marginHorizontal: 35,
              marginVertical: 15,
            }}
          />

          <Text
            fontSize={12}
            fontWeight="600"
            textColor={Style.fontColorLightGrey}
            marginLeft={25}
            marginBottom={5}>
            Plano de manutenção
          </Text>

          {planManutScreens.map((x, index) => (
            <DrawerItem
              key={index}
              active={key === x.route.key}
              onPress={() => props.navigation.navigate(x.route.name)}>
              <Text
                textColor={
                  key === x.route.key ? 'white' : Style.theme.mainColor
                }
                fontWeight="600">
                {x.options.drawerLabel?.toString() || x.route.name}
              </Text>
            </DrawerItem>
          ))}
        </RenderIf>

        {/* Manutenção screens */}
        <RenderIf condition={hasManutScreens}>
          <Divider
            style={{
              height: 1,
              backgroundColor: Style.theme.lighterSecondary,
              marginHorizontal: 35,
              marginVertical: 15,
            }}
          />

          <Text
            textColor={Style.fontColorLightGrey}
            fontSize={12}
            fontWeight="600"
            marginLeft={25}
            marginBottom={5}>
            Manutenção
          </Text>

          {manutScreens.map((x, index) => (
            <DrawerItem
              key={index}
              active={key === x.route.key}
              onPress={() => props.navigation.navigate(x.route.name)}>
              <Text
                textColor={
                  key === x.route.key ? 'white' : Style.theme.mainColor
                }
                fontWeight="600">
                {x.options.drawerLabel?.toString() || x.route.name}
              </Text>
            </DrawerItem>
          ))}
        </RenderIf>

        {/* Configurações screens */}
        <RenderIf condition={hasConfScreens}>
          <Divider
            style={{
              height: 1,
              backgroundColor: Style.theme.lighterSecondary,
              marginHorizontal: 35,
              marginVertical: 15,
            }}
          />

          <Text
            fontSize={12}
            fontWeight="600"
            variance="secondary"
            marginLeft={25}
            marginBottom={5}>
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
        </RenderIf>
      </ScrollView>

      <Styled css="padding: 5px 20px;">
        <TouchableOpacity
          onPress={() => {
            dispatch(selectClient(undefined));
          }}>
          <Styled type="row" alignItems="center" css="margin: 15px 5px;">
            <Icon name="edit" size={25} color={Style.theme.secondary[30]} />
            {clienteLogado && (
              <Text
                textColor={Style.theme.secondary[40]}
                marginLeft={10}
                fontWeight="700">
                {clienteLogado.nomeFantasia}
              </Text>
            )}
          </Styled>
        </TouchableOpacity>
        <Button
          title="Sair"
          backgroundColor={Style.cleanColorDarker}
          textColor={Style.theme.mainColor}
          size={'xxsm'}
          marginBottom={10}
          variance={'primary'}
          leftIcon={
            <Icon name="sign-out" size={20} color={Style.theme.mainColor} />
          }
          onPress={() => dispatch(logOut())}
        />
      </Styled>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: Style.theme.lighterPrimary,
    borderBottomRightRadius: 30,
  },
});

export default SidebarDrawer;
