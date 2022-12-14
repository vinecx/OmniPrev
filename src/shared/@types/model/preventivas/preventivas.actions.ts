import { formatISOwithTimezone } from './../../../../commons/masks/masks';
import { IRootState } from './../../../../store/index';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { nanoid } from 'nanoid/non-secure';
import store from '../../../../store';
import LocaisActions from '../locais/locais.actions';
import { IPreventiva } from './preventivas';

export default class PreventivaActions {
  private repo = database();
  private clientPath: string = 'preventivas';
  private locais: LocaisActions;

  constructor() {
    const state = store.getState() as IRootState;

    if (state.auth.clienteLogado) {
      this.clientPath = state.auth.clienteLogado.id + '/' + this.clientPath;
    }

    this.locais = new LocaisActions();
  }

  async cadastrar(params: IPreventiva) {
    if (params.id) {
      await this.repo
        .ref(`/${this.clientPath}/${params.id}`)
        .set(params)
        .catch(x => {
          return { error: true, errorMessage: JSON.stringify(x, null, 2) };
        });

      this.increaseCounter();
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

  async excluir(preventiva: IPreventiva) {
    // Excluir imagens relacionadas a preventiva
    preventiva.tarefas?.forEach(tarefa => {
      tarefa.imagesLink?.forEach(image => {
        storage().ref(image.fileName).delete();
      });
    });

    await this.repo
      .ref(`/${this.clientPath}/${preventiva.id}`)
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
      data?: IPreventiva[];
      error: boolean;
      errorMessage: string;
    }>(async (resolve, reject) => {
      let qtdPreventivas = 0;
      const response = await this.repo
        .ref(`/${this.clientPath}`)
        .orderByChild('data')
        .once('value')
        .then(preventivas => {
          const a: IPreventiva[] = [];

          preventivas.forEach(preventiva => {
            a.push(preventiva.val());

            return false;
          });

          qtdPreventivas = preventivas.numChildren();

          return a;
        })
        .catch(x => {
          reject({
            error: true,
            errorMessage: JSON.stringify(x),
          });
        });

      const preventivas: IPreventiva[] = [];

      await new Promise(async resolveInner => {
        if (Array.isArray(response) && response.length > 0) {
          await response.forEach(async (x: IPreventiva, index) => {
            let obj = x;

            const { data } = await this.locais.buscarPorCodigo(obj.localId);

            if (data) {
              obj.localDesc = data.nome;
            } else {
              obj.localDesc = 'Local n??o encontrado';
            }

            preventivas.push(obj);
            if (preventivas.length === qtdPreventivas) {
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
        data: preventivas,
      });
    });
  }

  async concluirTarefa(
    idPreventiva: string,
    idTarefa: number,
    observacao: String,
    hasError: boolean,
  ) {
    await this.repo
      .ref(
        `/${this.clientPath}/${idPreventiva}/tarefas/${idTarefa}/${
          hasError ? 'error' : 'concluida'
        }`,
      )
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
        .then<IPreventiva>(x => x.val())
        .catch(x => {
          throw JSON.stringify(x, null, 2);
        });

      const preventiva: IPreventiva = response;

      const { data } = await this.locais.buscarPorCodigo(response.localId);

      if (data) {
        response.localDesc = data.nome;
      }

      return {
        error: false,
        errorMessage: '',
        data: preventiva,
      };
    } catch (e) {
      return { error: true, errorMessage: String(e) };
    }
  }

  async increaseCounter() {
    await this.repo
      .ref(`/${this.clientPath}_count}`)
      .set(+1)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });
  }
  async decreaseCounter() {}
}
