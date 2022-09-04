import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../screens.enum';

import Index from '../../pages/Manutencao/Usuarios';
import Cadastro from '../../pages/Manutencao/Usuarios/Cadastro';

const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={ScreenName.Usuarios} component={() => <Index />} />
      <Stack.Screen
        name={ScreenName.Cadastro_Usuarios}
        component={() => <Cadastro />}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
