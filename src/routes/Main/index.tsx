import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';

import Preventiva from './preventiva';
import Corretiva from './corretiva';
import Relatorios from './relatorios';
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
  <Drawer.Screen
    name={'root.corretivas'}
    component={Corretiva}
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
  <Drawer.Screen
    name={'app.relatorios'}
    component={Relatorios}
    options={{
      drawerLabel: 'Relatórios',
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
