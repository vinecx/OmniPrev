import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { ScreenName } from '../screens.enum';

import Clientes from './clientes';
import Items from './items';
import Locais from './locais';
import Usuarios from './usuarios';

const Drawer = createDrawerNavigator();

export const AdministradorScreens = [
  <Drawer.Screen
    name={ScreenName.Usuarios}
    component={() => <Usuarios />}
    options={{
      headerTitle: 'Usuários',
      drawerLabel: 'Usuários',
    }}
  />,
  <Drawer.Screen
    name={ScreenName.Clientes}
    component={() => <Clientes />}
    options={{
      headerTitle: 'Clientes',
      drawerLabel: 'Clientes',
    }}
  />,
  <Drawer.Screen
    name={ScreenName.Items}
    component={() => <Items />}
    options={{
      headerTitle: 'Items',
      drawerLabel: 'Items',
    }}
  />,
  <Drawer.Screen
    name={ScreenName.Locais}
    component={() => <Locais />}
    options={{
      headerTitle: 'Locais de manutenção',
      drawerLabel: 'Locais',
    }}
  />,
];

export default AdministradorScreens;
