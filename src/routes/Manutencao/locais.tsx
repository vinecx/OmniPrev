import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../screens.enum';

import Index from '../../pages/Manutencao/Locais';
import Cadastro from '../../pages/Manutencao/Locais/Cadastro';

import Style from '../../commons/Style';
import HeaderButtonDrawer from '../../shared/components/Headers/MenuDrawerButton';

const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontSize: 18,
          color: Style.theme.lighterSecondary,
        },

        headerTitle: 'Cadastro de Locais',
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderButtonDrawer />,
        headerStyle: {
          backgroundColor: Style.theme.mainColor,
          elevation: 0,
        },

        cardStyle: {
          backgroundColor: Style.theme.mainColor,
        },
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
