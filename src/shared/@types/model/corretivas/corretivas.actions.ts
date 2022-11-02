import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { nanoid } from 'nanoid/non-secure';
import store from '../../../../store';
import { IRootState } from '../../../../store/index';
import LocaisActions from '../locais/locais.actions';
import { ICorretiva } from './corretivas';

export default class CorretivasActions {
  repo = database();
  clientPath: string = 'corretivas';
  locais: LocaisActions;

  constructor() {
    const state = store.getState() as IRootState;

    if (state.auth.clienteLogado) {
      this.clientPath = state.auth.clienteLogado.id + '/' + this.clientPath;
    }

    this.locais = new LocaisActions();
  }

  async cadastrar(params: ICorretiva) {
    if (params.id) {
      await this.repo
        .ref(`/${this.clientPath}/${params.id}`)
        .set(params)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      return { error: false, errorMessage: '' };
    } else {
      params.id = nanoid(25);
      await this.repo
        .ref(`/${this.clientPath}/${params.id}`)
        .set(params)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      return { error: false, errorMessage: '' };
    }
  }

  async excluir(corretiva: ICorretiva) {
    // Excluir imagens relacionadas a preventiva
    corretiva.tarefas?.forEach(tarefa => {
      tarefa.imagesLink?.forEach(image => {
        storage().ref(image.fileName).delete();
      });
    });

    await this.repo
      .ref(`/${this.clientPath}/${corretiva.id}`)
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
    return new Promise<{
      data?: ICorretiva[];
      error: boolean;
      errorMessage: string;
    }>(async (resolve, reject) => {
      let qtdCorretivas = 0;
      const response = await this.repo
        .ref(`/${this.clientPath}`)
        .orderByChild('data')
        .once('value')
        .then(corretivas => {
          const a: ICorretiva[] = [];

          corretivas.forEach(corretiva => {
            a.push(corretiva.val());

            return false;
          });

          qtdCorretivas = corretivas.numChildren();
          return a;
        })
        .catch(x => {
          reject({
            error: true,
            errorMessage: JSON.stringify(x),
          });
        });

      const corretivas: ICorretiva[] = [];

      await new Promise(resolveInner => {
        if (Array.isArray(response) && response.length > 0) {
          response.forEach(async (x: ICorretiva, index) => {
            let obj = x;

            const { data } = await this.locais.buscarPorCodigo(obj.localId);

            if (data) {
              obj.localDesc = data.nome;
            }

            corretivas.push(obj);

            if (corretivas.length === qtdCorretivas) {
              resolveInner(true);
            }
          });
        } else {
          resolveInner(true);
        }
      });

      resolve({
        error: false,
        errorMessage: '',
        data: corretivas,
      });
    });
  }

  async concluirTarefa(
    idCorretiva: string,
    idTarefa: number,
    observacao: String,
  ) {
    await this.repo
      .ref(`/${this.clientPath}/${idCorretiva}/tarefas/${idTarefa}/concluida`)
      .set({
        observacao,
        data: new Date().toLocaleString(),
      })
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  }

  async buscarPorCodigo(codigo: string) {
    try {
      const response = await this.repo
        .ref(`/${this.clientPath}/${codigo}`)
        .once('value')
        .then<ICorretiva>(x => x.val())
        .catch(x => {
          throw JSON.stringify(x, null, 2);
        });

      const corretiva: ICorretiva = response;

      const { data } = await this.locais.buscarPorCodigo(response.localId);

      if (data) {
        response.localDesc = data.nome;
      }

      return {
        error: false,
        errorMessage: '',
        data: corretiva,
      };
    } catch (e) {
      return { error: true, errorMessage: String(e) };
    }
  }
}
