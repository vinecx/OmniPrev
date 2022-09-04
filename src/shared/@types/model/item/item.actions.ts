import { buscarPorCodigo as localActionsBuscar } from './../locais/locais.actions';
import database from '@react-native-firebase/database';
import { IItem } from './item';

import { nanoid } from 'nanoid/non-secure';

export const cadastrar = async (usuario: IItem) => {
  if (usuario.id) {
    await database()
      .ref(`/items/${usuario.id}`)
      .set(usuario)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  } else {
    usuario.id = nanoid(25);
    await database()
      .ref(`/items/${usuario.id}`)
      .set(usuario)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  }
};

export const editar = async () => {};

export const excluir = async (id: string) => {
  await database()
    .ref(`/items/${id}`)
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
  const response = await database().ref('/items').once('value');

  const data: IItem[] = [];
  response.forEach(x => data.push(x.val()));

  return {
    error: false,
    errorMessage: '',
    data: data as IItem[],
  };
};

export const buscarPorCodigo = async (codigo: string) => {
  const response = await database()
    .ref(`/items/${codigo}`)
    .once('value')
    .then(x => x.val())
    .catch(x => {
      return { error: true, errorMessage: JSON.stringify(x, null, 2) };
    });

  const data: IItem = response;

  // Busca de Local vinculado ao item
  const { data: localData, error } = await localActionsBuscar(data.elemento);

  if (!error) {
    data.elementoDesc = localData.nome;
  }

  return {
    error: false,
    errorMessage: '',
    data: data as IItem,
  };
};
