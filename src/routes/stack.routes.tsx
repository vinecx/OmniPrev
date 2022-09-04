import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import Style from '../commons/Style';
import Login, { StackProps as LoginProps } from '../pages/Login';
import Main from '../pages/Main';
import { AuthState } from '../shared/@types/auth/types';
import HeaderButtonDrawer from '../shared/components/Headers/MenuDrawerButton';
import DrawerMenu from '../shared/components/MenuDrawer';
import { IRootState } from '../store';
import { ScreenName } from './screens.enum';
import { useOrientation } from '../shared/utils/CustomHooks/useOrientation';

// Screens
import { AdministradorScreens } from './Manutencao/index';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const Navigation = () => {
  const { user } = useSelector<IRootState, AuthState>(state => state.auth);
  const orientation = useOrientation();
  const isPortrait = orientation === 'PORTRAIT';

  if (user === undefined) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenName.Login}
          component={Login}
          options={() => LoginProps}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="MainApp"
      screenOptions={{
        overlayColor: 'transparent',

        swipeEdgeWidth: 100,
        headerTintColor: 'red',
        drawerStyle: {
          backgroundColor: 'transparent',
          width: isPortrait ? '75%' : '35%',
        },
        drawerLabelStyle: {
          color: Style.drawer.itemFontColor,
        },
        drawerActiveBackgroundColor: Style.drawer.itemBackgroundColor,
        drawerType: 'slide',
        headerTitleStyle: {
          fontSize: 18,
          color: Style.theme.primary,
        },

        headerTitleAlign: 'center',
        headerLeft: () => <HeaderButtonDrawer />,
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
        },
      }}
      drawerContent={(props: any) => <DrawerMenu {...props} />}>
      <Drawer.Screen
        name={ScreenName.InitialPage}
        component={Main}
        options={{
          headerTitle: 'Página inicial',
          drawerItemStyle: { display: 'none' },
          drawerLabel: 'Início',
        }}
      />

      {AdministradorScreens.map(screens => screens)}
    </Drawer.Navigator>
  );
};
