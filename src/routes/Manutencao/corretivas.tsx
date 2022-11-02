import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../screens.enum';

import Index from '../../pages/PlanoManutencao/Corretivas';
import Cadastro from '../../pages/PlanoManutencao/Corretivas/Cadastro';
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

        headerTitle: 'Corretivas',
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
      <Stack.Screen name={ScreenName.Corretivas} component={() => <Index />} />
      <Stack.Screen
        name={ScreenName.Cadastro_Corretivas}
        component={() => <Cadastro />}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
