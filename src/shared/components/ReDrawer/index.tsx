import { DrawerItem } from '@react-navigation/drawer';
import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerNavigationState, ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { Drawer } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { logOut } from '../../../store/modules/auth/authSlice';
import { AuthState } from '../../@types/auth/types';
import {
  DCSView,
  DrawerContainer,
  DrawerContainerInfo,
  TextCompany,
  TextUser,
} from './styles';

declare type Props = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

const ReDrawer: React.FC<Props> = props => {
  const dispatch = useDispatch();

  const { user, company } = useSelector<IRootState, AuthState>(
    state => state.auth,
  );

  const screens = Object.values(props.descriptors);
  const appScreens = screens.filter(x => x.route.name.includes('app.'));
  const confScreens = screens.filter(x => x.route.name.includes('conf.'));

  const key = screens[props.state.index].route.key || '';

  return (
    <DCSView {...props}>
      <DrawerContainer>
        <DrawerContainerInfo>
          <TextUser>Olá, {user?.desPessoa}!</TextUser>
          <TextCompany>
            Empresa {company?.idEmpresa} - {company?.desEmpresa}
          </TextCompany>
        </DrawerContainerInfo>

        <Drawer.Section title="APP">
          {appScreens.map((x, index) => (
            <Drawer.Item
              key={index}
              label={x.options.drawerLabel?.toString() || x.route.name}
              active={key === x.route.key}
              onPress={() => props.navigation.navigate(x.route.name)}
            />
          ))}
        </Drawer.Section>

        <Drawer.Section title="Configurações">
          {confScreens.map((x, index) => (
            <Drawer.Item
              key={index}
              label={x.options.drawerLabel?.toString() || x.route.name}
              active={key === x.route.key}
              onPress={() => props.navigation.navigate(x.route.name)}
            />
          ))}
        </Drawer.Section>

        <DrawerItem label="Log-out" onPress={() => dispatch(logOut())} />
      </DrawerContainer>
    </DCSView>
  );
};

export default ReDrawer;
