import database from '@react-native-firebase/database';
import { nanoid } from 'nanoid/non-secure';
import { ILocal } from './locais';

export const cadastrar = async (params: ILocal) => {
  if (params.id) {
    await database()
      .ref(`/locais/${params.id}`)
      .set(params)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  } else {
    params.id = nanoid(25);
    await database()
      .ref(`/locais/${params.id}`)
      .set(params)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  }
};

export const editar = async () => {};

export const excluir = async (id: string) => {
  await database()
    .ref(`/locais/${id}`)
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
  const response = await database().ref('/locais').once('value');

  const data: ILocal[] = [];
  response.forEach(x => {
    data.push(x.val());
  });

  return {
    error: false,
    errorMessage: '',
    data: data as ILocal[],
  };
};

export const buscarPorCodigo = async (codigo: string) => {
  const response = await database()
    .ref(`/locais/${codigo}`)
    .once('value')
    .then(x => x.val())
    .catch(x => {
      return { error: true, errorMessage: JSON.stringify(x, null, 2) };
    });

  const data: ILocal = response;

  return {
    error: false,
    errorMessage: '',
    data: data as ILocal,
  };
};
