import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../screens.enum';

import Index from '../../pages/Manutencao/Locais';
import Cadastro from '../../pages/Manutencao/Locais/Cadastro';

const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={ScreenName.Locais} component={() => <Index />} />
      <Stack.Screen
        name={ScreenName.Cadastro_Locais}
        component={() => <Cadastro />}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
