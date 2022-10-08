import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { ScreenName } from '../screens.enum';
import { Animated, Easing } from 'react-native';

import Preventiva from '../../pages/Main/Preventivas/preventiva.screen';
import Tarefa from '../../pages/Main/Preventivas/tarefa.screen';

import Style from '../../commons/Style';
import HeaderButtonDrawer from '../../shared/components/Headers/MenuDrawerButton';

const Stack = createStackNavigator();

export const Navigation = () => {
  // Animations
  const zoom = useRef(new Animated.Value(1000)).current;

  Animated.timing(zoom, {
    toValue: 0,
    delay: 200,
    duration: 500,
    useNativeDriver: true,
  }).start();

  return (
    <Stack.Navigator
      screenOptions={{
        detachPreviousScreen: false,
        headerMode: 'screen',
        headerTitleStyle: {
          fontSize: 18,
          color: Style.theme.lighterSecondary,
        },
        headerLeft: () => <HeaderButtonDrawer />,
        headerStyle: {
          backgroundColor: Style.theme.mainColor,
          elevation: 0,
        },
        headerTransparent: true,
        cardStyle: { backgroundColor: 'transparent' }, //Optional
      }}>
      <Stack.Screen
        options={{
          headerTitle: 'Detalhes da preventiva',
          presentation: 'modal',
          cardOverlayEnabled: true,
        }}
        name={ScreenName.Main_preventivas}
        component={Preventiva}
      />
      <Stack.Screen
        name={ScreenName.Main_preventivas_tarefas}
        options={{
          headerTitle: 'Tarefa',
          headerTransparent: false,
        }}
        component={Tarefa}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
