import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import CreateAccount from '../pages/Login/CreateAccount';
import Style from '../commons/Style';
import Login, { StackProps as LoginProps } from '../pages/Login';
import Main from '../pages/Main';
import { AuthState } from '../shared/@types/auth/types';
import HeaderButtonDrawer from '../shared/components/Headers/MenuDrawerButton';
import ReDrawer from '../shared/components/ReDrawer';
import { IRootState } from '../store';
import { ScreenName } from './screens.enum';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const Navigation = () => {
  const { user } = useSelector<IRootState, AuthState>(state => state.auth);


  if (!user || !user.idUsuario) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenName.Login}
          component={Login}
          options={() => LoginProps}
        />
        <Stack.Screen
          name={ScreenName.CreateAccount}
          component={CreateAccount}
          options={() => LoginProps}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="MainApp"
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'transparent',
        },
        drawerLabelStyle: {
          color: Style.mainColor,
        },
        drawerActiveBackgroundColor: Style.warning,
        drawerType: 'slide',
      }}
      drawerContent={(props: any) => <ReDrawer {...props} />}>
      <Drawer.Screen
        name={ScreenName.InitialPage}
        component={Main}
        options={{
          headerTitle: 'Página inicial',
          drawerItemStyle: { display: 'none' },
          drawerLabel: 'Início',
          headerLeft: () => <HeaderButtonDrawer hideLogo />,
        }}
      />
    </Drawer.Navigator>
  );
};
