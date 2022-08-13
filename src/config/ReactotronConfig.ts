import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare global {
  interface Console {
    tron: any;
  }
}

if (__DEV__) {
  const { scriptURL } = NativeModules.SourceCode;
  const host = scriptURL.split('://')[1].split(':')[0];
  const tron = Reactotron.setAsyncStorageHandler!(AsyncStorage)
    .configure({ host })
    .useReactNative()
    .use(reactotronRedux())
    .connect();

  console.tron = tron;
  tron.clear!();
}
