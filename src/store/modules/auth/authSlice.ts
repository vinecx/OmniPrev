import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import api from '../../../services/api';
import { TipAcesso } from '../../../shared/@types/auth/enum';
import {
  AuthState,
  IPermission,
  LoginVO,
  User,
} from '../../../shared/@types/auth/types';
import { IRootState } from './../../index';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const PREFIX = 'app/auth';

const TOKEN_KEY = '@auth/token';

export const logIn = createAsyncThunk(
  `${PREFIX}/logIn`,
  async (action: LoginVO, payload) => {
    if (!action.username || !action.password) {
      throw new Error('Usuário e senha são obrigatórios.');
    }

    console.log('Logando');
    const a = await auth()
      .signInWithEmailAndPassword(action.username, action.password)
      .then((x: FirebaseAuthTypes.UserCredential) => console.log(x))
      .catch((x: FirebaseAuthTypes.NativeFirebaseAuthError) =>
        console.log('Errro: ', x.message),
      )
      .finally(() => console.log('Finaly'));
    console.log(a);

    const resp = await api.post('/api/authenticate/login', {
      ...action,
    });

    if (!resp) {
      throw new Error('Não foi possivel fazer o login.');
    }
    const token = resp.data.id_token;
    await payload.dispatch(getPermissions());

    return token;
  },
);

export const createUser = createAsyncThunk(
  `${PREFIX}/createUser`,
  async (action: LoginVO & { name: string }, { dispatch, rejectWithValue }) => {
    if (!action.username || !action.password) {
      throw new Error('Usuário e senha são obrigatórios.');
    }

    const { user, additionalUserInfo } = await auth()
      .createUserWithEmailAndPassword(action.username, action.password)
      .catch((x: FirebaseAuthTypes.NativeFirebaseAuthError) => {
        throw rejectWithValue(x.message);
      });

    console.log(user, additionalUserInfo);
    database()
      .ref('/users/123')
      .set({
        name: 'Ada Lovelace',
        age: 31,
      })
      .then(() => console.log('Data set.'));

    await dispatch(getPermissions());

    return user;
  },
);

export const logOut = createAsyncThunk(`${PREFIX}/logOut`, async () => {
  api.defaults.headers.Authorization = '';
  await AsyncStorage.removeItem(TOKEN_KEY);
  return '';
});

export const getUser = createAsyncThunk(`${PREFIX}/getUser`, async () => {
  const response = await api.get('/api/authenticate/account');
  if (!response) {
    throw new Error('Não foi possivel buscar o usuário.');
  }
  return response.data;
});

export const getPermissions = createAsyncThunk(
  'app/auth/getPermissions',
  async () => {
    const response = await api.get<IPermission>('/api/authenticate/permission');
    return response.data;
  },
);

export const hasPermission = createAsyncThunk(
  `${PREFIX}/hasPermission`,
  async (_, payload) => {
    const state = payload.getState() as IRootState;
    if (
      state.auth.permission.tipAcesso &&
      state.auth.permission.tipAcesso !== TipAcesso.FULL_ACCESS
    ) {
      payload.dispatch(logOut());
      throw new Error('Usuário sem permissão de acesso ao aplicativo.');
    }
  },
);

const initialState: AuthState = {
  user: undefined,
  loading: false,
  permission: {},
};

const authSlice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getPermissions.fulfilled, (state, action) => {
      state.permission = action.payload;
    });

    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });

    builder.addCase(logOut.fulfilled, state => {
      state.user = {} as User;
    });

    builder.addCase(logIn.rejected, state => {
      state.errors =
        'Não foi possível fazer o login. Verifique seu usuário e senha.';
    });

    builder.addCase(hasPermission.rejected, (state, action) => {
      state.errors = action.error.message;
    });

    builder.addMatcher(
      isAnyOf(
        logIn.pending,
        logOut.pending,
        getUser.pending,
        getPermissions.pending,
      ),
      state => {
        state.loading = true;
      },
    );

    builder.addMatcher(
      isAnyOf(
        logIn.fulfilled,
        logOut.fulfilled,
        getUser.fulfilled,
        getPermissions.fulfilled,
      ),
      state => {
        state.errors = undefined;
        state.loading = false;
      },
    );

    builder.addMatcher(
      isAnyOf(
        logIn.rejected,
        logOut.rejected,
        getUser.rejected,
        createUser.rejected,
      ),
      (state, payload) => {
        if (payload.meta.rejectedWithValue) {
          state.errors = `Erro ao processar solicitação: ${payload.payload}`;
        }
        state.loading = false;
      },
    );
  },
});

export default authSlice.reducer;
