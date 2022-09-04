import database from '@react-native-firebase/database';
import { ICliente } from './clientes';

import { nanoid } from 'nanoid/non-secure';

export const cadastrarCliente = async (cliente: ICliente) => {
  if (cliente.id) {
    await database()
      .ref(`/clientes/${cliente.id}`)
      .set(cliente)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  } else {
    cliente.id = nanoid(25);

    await database()
      .ref(`/clientes/${cliente.id}`)
      .set(cliente)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  }
};

export const excluirCliente = async (id: string) => {
  await database()
    .ref(`/clientes/${id}`)
    .remove()
    .catch(x => {
      return { error: true, errorMessage: JSON.stringify(x, null, 2) };
    });

  return {
    error: false,
    errorMessage: '',
  };
};

export const buscarClienteCodigo = async (codigoCliente: string) => {
  const response = await database()
    .ref(`/clientes/${codigoCliente}`)
    .once('value')
    .then(x => x.val())
    .catch(x => {
      return { error: true, errorMessage: JSON.stringify(x, null, 2) };
    });

  const data: ICliente = response;

  return {
    error: false,
    errorMessage: '',
    data: data as ICliente,
  };
};

export const buscarTodosClientes = async () => {
  const response = await database().ref('/clientes').once('value');

  const data: ICliente[] = [];
  response.forEach(x => data.push(x.val()));

  return {
    error: false,
    errorMessage: '',
    data: data as ICliente[],
  };
};
