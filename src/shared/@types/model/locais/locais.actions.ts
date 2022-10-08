import database from '@react-native-firebase/database';
import { nanoid } from 'nanoid/non-secure';
import store, { IRootState } from '../../../../store';
import { ILocal } from './locais';

export default class LocaisActions {
  repo = database();
  clientPath: string = 'locais';

  constructor() {
    const state = store.getState() as IRootState;

    if (state.auth.clienteLogado) {
      this.clientPath = state.auth.clienteLogado.id + '/' + this.clientPath;
    }
  }

  async cadastrar(params: ILocal) {
    if (params.id) {
      await database()
        .ref(`/${this.clientPath}/${params.id}`)
        .set(params)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      return { error: false, errorMessage: '' };
    } else {
      params.id = nanoid(25);
      await database()
        .ref(`/${this.clientPath}/${params.id}`)
        .set(params)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      return { error: false, errorMessage: '' };
    }
  }

  editar = async () => {};

  async excluir(id: string) {
    await database()
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

  async buscarTodos() {
    const response = await this.repo.ref(`/${this.clientPath}`).once('value');

    const data: ILocal[] = [];
    response.forEach(x => {
      data.push(x.val());
      return undefined;
    });

    return {
      error: false,
      errorMessage: '',
      data: data as ILocal[],
    };
  }

  async buscarPorCodigo(codigo: string) {
    const response = await database()
      .ref(`/${this.clientPath}/${codigo}`)
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
  }
}
