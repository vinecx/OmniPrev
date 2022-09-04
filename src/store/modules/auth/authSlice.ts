import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import api from '../../../services/api';
import { AuthState, LoginVO } from '../../../shared/@types/auth/types';
import { FirebaseErrorMessageByCode } from './../../../shared/@types/auth/Firebase/firebaseMessages';
import { IUsuario } from './../../../shared/@types/model/usuario/usuario';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import database, {
  FirebaseDatabaseTypes,
} from '@react-native-firebase/database';

const PREFIX = 'app/auth';

export const logIn = createAsyncThunk(
  `${PREFIX}/logIn`,
  async (action: LoginVO, { rejectWithValue }) => {
    if (!action.email || !action.password) {
      throw new Error('Usuário e senha são obrigatórios.');
    }

    const { user } = await auth()
      .signInWithEmailAndPassword(action.email, action.password)
      .catch((x: FirebaseAuthTypes.NativeFirebaseAuthError) => {
        throw rejectWithValue(FirebaseErrorMessageByCode(x.code));
      });

    const response = await database()
      .ref(`/usuarios/${user.uid}`)
      .once('value')
      .then<FirebaseDatabaseTypes.DataSnapshot>(x => {
        if (!x.exists()) {
          throw rejectWithValue('Usuário não encontrado');
        }
        return x;
      })
      .catch(_ => {
        console.error(_);
        throw rejectWithValue(
          'Erro ao realizar o login, tente novamente mais tarde',
        );
      });

    return response.val() as IUsuario;
  },
);

export const logOut = createAsyncThunk(`${PREFIX}/logOut`, async _ => {
  await auth().signOut();
  return undefined;
});

export const getUser = createAsyncThunk(`${PREFIX}/getUser`, async () => {
  const response = await api.get('/api/authenticate/account');
  if (!response) {
    throw new Error('Não foi possivel buscar o usuário.');
  }
  return response.data;
});

const initialState: AuthState = {
  user: undefined,
  loading: false,
};

const authSlice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });

    builder.addCase(logIn.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    builder.addCase(logOut.fulfilled, state => {
      state.user = undefined;
    });

    builder.addMatcher(
      isAnyOf(logIn.pending, logOut.pending, getUser.pending),
      state => {
        state.loading = true;
      },
    );

    builder.addMatcher(
      isAnyOf(logIn.fulfilled, logOut.fulfilled, getUser.fulfilled),
      state => {
        state.errors = undefined;
        state.loading = false;
      },
    );

    builder.addMatcher(
      isAnyOf(logIn.rejected, logOut.rejected, getUser.rejected),
      (state, payload) => {
        if (payload.meta.rejectedWithValue || payload.payload) {
          state.errors = `${payload.payload}`;
        }
        state.loading = false;
      },
    );
  },
});

export default authSlice.reducer;
