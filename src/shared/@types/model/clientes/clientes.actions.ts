import database from '@react-native-firebase/database';
import { ICliente } from './clientes';
import store, { IRootState } from '../../../../store';

import { nanoid } from 'nanoid/non-secure';

export default class ClienteActions {
  repo = database();
  clientPath: string = 'clientes';

  constructor() {}

  async cadastrarCliente(cliente: ICliente) {
    if (cliente.id) {
      await this.repo
        .ref(`/${this.clientPath}/${cliente.id}`)
        .set(cliente)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      return { error: false, errorMessage: '' };
    } else {
      cliente.id = nanoid(25);

      await this.repo
        .ref(`/${this.clientPath}/${cliente.id}`)
        .set(cliente)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      return { error: false, errorMessage: '' };
    }
  }

  async excluirCliente(id: string) {
    await this.repo
      .ref(`/${this.clientPath}/${id}`)
      .remove()
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return {
      error: false,
      errorMessage: '',
    };
  }

  async buscarClienteCodigo(codigoCliente: string) {
    const response = await this.repo
      .ref(`/${this.clientPath}/${codigoCliente}`)
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
  }

  async buscarTodosClientes() {
    const response = await this.repo.ref(`/${this.clientPath}`).once('value');

    const data: ICliente[] = [];
    response.forEach(x => data.push(x.val()));

    return {
      error: false,
      errorMessage: '',
      data: data as ICliente[],
    };
  }
}
