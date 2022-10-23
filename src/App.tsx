import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Style from './commons/Style';
import Routes from './routes';
import LoadingScreen from './shared/components/LoadingScreen';
import ReStatusBar from './shared/components/ReStatusBar';
// Modify to add persistor
import store, { persistor } from './store';

import Middlewares from './Middlewares';

import messaging from '@react-native-firebase/messaging';
import { StatusBar } from 'react-native';
import Logo from './assets/logo/full_logo_white.png';
LogBox.ignoreLogs(['warning', 'errors']);

const App = () => {
  if (__DEV__) {
    import('./config/ReactotronConfig').then(
      () => (console.tron = 'Reactotron Configured'),
    );
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  messaging()
    .registerDeviceForRemoteMessages()
    .then(async () => {
      // const token = await messaging().getToken();
      // console.log(token);
    });

  const theme = {
    ...DefaultTheme,
    roundness: 20,
    colors: {
      ...DefaultTheme.colors,
      primary: Style.theme.primary,
      accent: Style.theme.secondary[40],
    },
  };

  const LoadingScreenConf = (
    <>
      <StatusBar backgroundColor={Style.mainColor} barStyle="dark-content">
        <LoadingScreen logo={Logo} logoSize={250} />
      </StatusBar>
    </>
  );

  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={LoadingScreenConf} persistor={persistor}>
          <PaperProvider theme={theme}>
            <Middlewares>
              <ReStatusBar />
              <Routes />
            </Middlewares>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
