import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../screens.enum';

import RelatorioView from '../../pages/Main/Relatorios';

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

        headerLeft: () => <HeaderButtonDrawer />,
        headerStyle: {
          backgroundColor: Style.theme.mainColor,
          elevation: 0,
        },

        gestureDirection: 'horizontal',
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 400,
            },
          },
          close: {
            animation: 'spring',
            config: {},
          },
        },
        headerStyleInterpolator: HeaderStyleInterpolators.forSlideRight,

        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              borderRadius: 50,
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
                {
                  scale: next
                    ? current.progress.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.7, 1],
                      })
                    : 1,
                },
              ],
            },
          };
        },
      }}>
      <Stack.Screen
        options={{
          headerTitle: 'Relatórios',
        }}
        name={ScreenName.Relatorios}
        component={() => <RelatorioView />}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
