import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { ScreenName } from '../screens.enum';

const Drawer = createDrawerNavigator();

import Clientes from './clientes';
import Itens from './items';
import Locais from './locais';
import Usuarios from './usuarios';
import Preventivas from './preventivas';
import Corretivas from './corretivas';

export const AdministradorScreens = [
  <Drawer.Screen
    name={ScreenName.Preventivas}
    component={() => <Preventivas />}
    options={{
      headerTitle: 'Preventivas',
      drawerLabel: 'Preventivas',
    }}
  />,
  <Drawer.Screen
    name={ScreenName.Corretivas}
    component={() => <Corretivas />}
    options={{
      headerTitle: 'Corretivas',
      drawerLabel: 'Corretivas',
    }}
  />,
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
    name={ScreenName.Itens}
    component={() => <Itens />}
    options={{
      headerTitle: 'Itens',
      drawerLabel: 'Itens',
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
