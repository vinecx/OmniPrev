import database, {
  FirebaseDatabaseTypes,
} from '@react-native-firebase/database';
import { nanoid } from 'nanoid/non-secure';
import { ILocal } from './locais';
import { IPreventiva } from './preventivas';
import { buscarPorCodigo as buscarLocalPorCodigo } from '../locais/locais.actions';

export const cadastrar = async (params: IPreventiva) => {
  if (params.id) {
    await database()
      .ref(`/preventivas/${params.id}`)
      .set(params)
      .catch(x => {
        return { error: true, errorMessage: JSON.stringify(x, null, 2) };
      });

    return { error: false, errorMessage: '' };
  } else {
    params.id = nanoid(25);
    await database()
      .ref(`/preventivas/${params.id}`)
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
    .ref(`/preventivas/${id}`)
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
  const response = await database()
    .ref('/preventivas')
    .once('value')
    .then(x => {
      const a = [];
      x.forEach(y => a.push(y.val()));
      return a;
    })
    .catch(x => {
      return {
        error: true,
        errorMessage: JSON.stringify(x),
      };
    });

  const preventivas: IPreventiva[] = [];

  await new Promise(resolve => {
    response.forEach(async (x: IPreventiva, index) => {
      let obj = x;

      const { data } = await buscarLocalPorCodigo(obj.localId);

      if (data) {
        obj.localDesc = data.descricao;
      }

      preventivas.push(obj);

      if (index === response.length - 1) {
        resolve(true);
      }
    });
  });

  return {
    error: false,
    errorMessage: '',
    data: preventivas as IPreventiva[],
  };
};

export const buscarPorCodigo = async (codigo: string) => {
  const response = await database()
    .ref(`/preventivas/${codigo}`)
    .once('value')
    .then(x => x.val())
    .catch(x => {
      return { error: true, errorMessage: JSON.stringify(x, null, 2) };
    });

  const preventiva: IPreventiva = response;

  const { data } = await buscarLocalPorCodigo(response.localId);

  if (data) {
    response.localDesc = data.descricao;
  }

  return {
    error: false,
    errorMessage: '',
    data: preventiva,
  };
};
