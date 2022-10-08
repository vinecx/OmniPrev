import database from '@react-native-firebase/database';
import { nanoid } from 'nanoid/non-secure';
import store, { IRootState } from '../../../../store';
import LocaisActions from './../locais/locais.actions';
import { IItem } from './item';

export default class ItensActions {
  repo = database();
  clientPath: string = 'items';
  locaisAction: LocaisActions;

  constructor() {
    const state = store.getState() as IRootState;

    this.locaisAction = new LocaisActions();

    if (state.auth.clienteLogado && state.auth.clienteLogado.id) {
      this.clientPath = state.auth.clienteLogado.id + '/' + this.clientPath;
    }
  }

  async cadastrar(usuario: IItem) {
    if (usuario.id) {
      await database()
        .ref(`/${this.clientPath}/${usuario.id}`)
        .set(usuario)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      return { error: false, errorMessage: '' };
    } else {
      usuario.id = nanoid(25);
      await database()
        .ref(`/${this.clientPath}/${usuario.id}`)
        .set(usuario)
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

    const data: IItem[] = [];
    response.forEach(x => {
      data.push(x.val());
      return undefined;
    });

    return {
      error: false,
      errorMessage: '',
      data: data as IItem[],
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

    const data: IItem = response;

    // Busca de Local vinculado ao item
    const { data: localData, error } = await this.locaisAction.buscarPorCodigo(
      data.elemento,
    );

    if (!error) {
      data.elementoDesc = localData.nome;
    }

    return {
      error: false,
      errorMessage: '',
      data: data as IItem,
    };
  }
}
