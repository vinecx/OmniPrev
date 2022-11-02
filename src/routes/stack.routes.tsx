import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import Style from '../commons/Style';
import { AuthState } from '../shared/@types/auth/types';
import HeaderButtonDrawer from '../shared/components/Headers/MenuDrawerButton';
import DrawerMenu from '../shared/components/MenuDrawer';
import { useOrientation } from '../shared/utils/CustomHooks/useOrientation';
import { IRootState } from '../store';
import { ScreenName } from './screens.enum';

// Screens
import Login from '../pages/Login';
import Main from '../pages/Main';
import SelectClient from '../pages/SelecionaCliente';
import { MainScreens } from './Main';
import { AdministradorScreens } from './Manutencao/index';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const Navigation = () => {
  const { user, clienteLogado } = useSelector<IRootState, AuthState>(
    state => state.auth,
  );
  const orientation = useOrientation();
  const isPortrait = orientation === 'PORTRAIT';

  if (user === undefined) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenName.Login}
          component={Login}
          options={{
            headerTitle: '',
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    );
  }

  if (clienteLogado === undefined) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenName.SelectClient}
          options={{
            headerTitle: '',
            headerTransparent: true,
          }}
          component={SelectClient}
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
          color: Style.theme.lighterSecondary,

          fontFamily: 'Poppins SemiBold',
        },

        headerTransparent: true,

        headerTitleAlign: 'center',
        headerLeft: () => <HeaderButtonDrawer />,
        headerStyle: {
          backgroundColor: Style.theme.mainColor,
          elevation: 0,
        },
        sceneContainerStyle: {
          backgroundColor: Style.theme.mainColor,
        },

        unmountOnBlur: false,
      }}
      drawerContent={(props: any) => <DrawerMenu {...props} />}
      defaultScreenOptions={{
        unmountOnBlur: false,
      }}>
      <Drawer.Screen
        name={ScreenName.InitialPage}
        component={Main}
        options={{
          headerTitle: 'OmniPrev',
          headerTitleStyle: {
            fontFamily: 'Poppins SemiBold',
            color: 'white',
          },
          drawerItemStyle: { display: 'none' },
          drawerLabel: 'Início',
        }}
      />

      <Drawer.Group
        screenOptions={{
          headerShown: false,
        }}>
        {AdministradorScreens}
      </Drawer.Group>

      <Drawer.Group>{MainScreens}</Drawer.Group>
    </Drawer.Navigator>
  );
};
