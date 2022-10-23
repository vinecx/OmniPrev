import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';
import { ScreenName } from '../../routes/screens.enum';

import Preventiva from './preventiva';
const Drawer = createStackNavigator();

export const MainScreens = [
  <Drawer.Screen
    name={'root.preventivas'}
    component={Preventiva}
    options={{
      headerShown: false,

      gestureDirection: 'horizontal',
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: 2000,
            delay: 300,
          },
        },
        close: {
          animation: 'timing',
          config: {
            duration: 3000,
            delay: 200,
          },
        },
      },
      headerStyleInterpolator: HeaderStyleInterpolators.forFade,

      cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.height, 0],
                }),
              },
              {
                scale: next
                  ? current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.9],
                    })
                  : 1,
              },
            ],
          },
        };
      },
    }}
  />,
];

export default MainScreens;
