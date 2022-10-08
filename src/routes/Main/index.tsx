import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import Preventiva from './preventiva';
const Drawer = createDrawerNavigator();

export const MainScreens = [
  <Drawer.Screen
    name={'root.preventivas'}
    component={Preventiva}
    options={{
      drawerItemStyle: { display: 'none' },
      headerShown: false,
      sceneContainerStyle: {
        backgroundColor: 'transparent',
      },
    }}
  />,
];

export default MainScreens;
