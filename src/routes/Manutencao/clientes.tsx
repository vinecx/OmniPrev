import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../screens.enum';

import Index from '../../pages/Manutencao/Clientes';
import Cadastro from '../../pages/Manutencao/Clientes/Cadastro';

const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={ScreenName.Clientes} component={() => <Index />} />
      <Stack.Screen
        name={ScreenName.Cadastro_Clientes}
        component={() => <Cadastro />}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
