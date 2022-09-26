import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Style from './commons/Style';
import Routes from './routes';
import LoadingScreen from './shared/components/LoadingScreen';
import ReStatusBar from './shared/components/ReStatusBar';
import { LogBox } from 'react-native';
// Modify to add persistor
import store, { persistor } from './store';

import Middlewares from './Middlewares';

import { StatusBar } from 'react-native';
import Logo from './assets/logo/full_logo_white.png';

LogBox.ignoreLogs(['warning']);

const App = () => {
  if (__DEV__) {
    import('./config/ReactotronConfig').then(
      () => (console.tron = 'Reactotron Configured'),
    );
  }

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
