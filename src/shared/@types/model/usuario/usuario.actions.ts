import { FirebaseErrorMessageByCode } from './../../auth/Firebase/firebaseMessages';
import database from '@react-native-firebase/database';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { IUsuario } from './usuario';

import { LoginVO } from 'shared/@types/auth/types';

export const cadastrar = async (usuario: IUsuario & Partial<LoginVO>) => {
  if (usuario.id) {
    await database()
      .ref(`/usuarios/${usuario.id}`)
      .set(usuario)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  } else {
    if (!usuario.password) {
      return {
        error: true,
        errorMessage: 'Senha obrigatória',
      };
    } else {
      try {
        const { user } = await auth()
          .createUserWithEmailAndPassword(usuario.email, usuario.password)
          .catch((x: FirebaseAuthTypes.NativeFirebaseAuthError) => {
            throw FirebaseErrorMessageByCode(x.code);
          });

        delete usuario.password;

        usuario.id = user.uid;

        await database()
          .ref(`/usuarios/${usuario.id}`)
          .set(usuario)
          .catch(x => {
            return { error: true, errorMessage: JSON.stringify(x, null, 2) };
          });

        return { error: false, errorMessage: '' };
      } catch (e) {
        return {
          error: true,
          errorMessage: JSON.stringify(e, null, 2),
          user: {} as any,
        };
      }
    }
  }
};

export const excluir = async (id: string) => {
  await database()
    .ref(`/usuarios/${id}`)
    .remove()
    .catch(x => {
      return { error: true, errorMessage: JSON.stringify(x, null, 2) };
    });

  return {
    error: false,
    errorMessage: '',
  };
};

export const buscarTodos = async () => {
  const response = await database().ref('/usuarios').once('value');

  const data: IUsuario[] = [];
  response.forEach(x => {
    data.push(x.val());
  });

  return {
    error: false,
    errorMessage: '',
    data: data as IUsuario[],
  };
};

export const buscarUsuarioPorCodigo = async (codigoUsuario: string) => {
  const response = await database()
    .ref(`/usuarios/${codigoUsuario}`)
    .once('value')
    .then(x => x.val())
    .catch(x => {
      return { error: true, errorMessage: JSON.stringify(x, null, 2) };
    });

  const data: IUsuario = response;

  return {
    error: false,
    errorMessage: '',
    data: data as IUsuario,
  };
};
