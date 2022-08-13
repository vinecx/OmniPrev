import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import store from '../store';
import { logOut, refreshToken } from '../store/modules/auth/authSlice';
const TOKEN_KEY = '@auth/token';

const getToken = async () => {
  return (await AsyncStorage.getItem(TOKEN_KEY)) as string;
};

export const apiCliente = axios.create();

apiCliente.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

apiCliente.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const oldtoken = await getToken();
    const originalConfig = err;
    if (
      oldtoken &&
      originalConfig.config.url === 'api/authenticate/token/refresh'
    ) {
      //@ts-ignore
      store.dispatch(logOut());
    }

    if (
      oldtoken &&
      originalConfig.config.url !== 'api/authenticate/account' &&
      originalConfig.config.url !== 'api/authenticate/token/refresh'
    ) {
      // token was expired
      if (err.response && err.response.status === 401) {
        try {
          const rs = await apiCliente.post('api/authenticate/token/refresh', {
            id_token: oldtoken,
          });

          const { id_token } = rs.data;

          originalConfig.config.headers = `Bearer ${id_token}`;
          //@ts-ignore
          store.dispatch(refreshToken(id_token));
          return apiCliente(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  },
);

export default apiCliente;
