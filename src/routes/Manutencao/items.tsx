import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../screens.enum';

import Index from '../../pages/Manutencao/Item';
import Cadastro from '../../pages/Manutencao/Item/Cadastro';

const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={ScreenName.Items} component={() => <Index />} />
      <Stack.Screen
        name={ScreenName.Cadastro_Items}
        component={() => <Cadastro />}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
