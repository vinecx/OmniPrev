import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScreenName } from '../../../routes/screens.enum';
import { ILocal } from '../../../shared/@types/model/locais/locais';
import {
  buscarTodos,
  excluir,
} from '../../../shared/@types/model/locais/locais.actions';
import { Button } from '../../../shared/components/commons/Button';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Listagem from './Listagem';

const Index = () => {
  const { navigate } = useNavigation();

  const [listagem, setListagem] = useState<ILocal[]>([]);
  const [loading, setLoading] = useState(false);

  const busca = async () => {
    setLoading(true);
    const { error, errorMessage, data } = await buscarTodos(); // Validações e cadastro

    if (!error) {
      setListagem(data);
    } else {
      ToastAndroid.show(
        String(errorMessage || 'Houve um erro na solicitação'),
        ToastAndroid.SHORT,
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    busca();
  }, []);

  const edit = async (local: ILocal) => {
    navigate(ScreenName.Cadastro_Locais as never, local as never);
  };

  const deleteItem = async (local: ILocal) => {
    setLoading(true);

    if (local.id) {
      const { error, errorMessage } = await excluir(local.id); // Validações e cadastro

      if (!error) {
        ToastAndroid.show('Local excluído com sucesso!', ToastAndroid.SHORT);
        busca();
      } else {
        ToastAndroid.show(
          String(errorMessage || 'Houve um erro na solicitação'),
          ToastAndroid.SHORT,
        );
      }
    }
    setLoading(false);
  };

  return (
    <Styled type="container" lg="display: flex;" css="flex: 1;">
      <RefreshControl
        style={{ flex: 1 }}
        refreshing={loading}
        onRefresh={busca}>
        <ScrollView keyboardDismissMode="on-drag">
          <Styled
            sm="width: 100%; flex: 1;"
            lg="width: 90%;"
            css="align-self: center;">
            <Button
              width="50%"
              title="Criar"
              size="sm"
              variance="primary"
              loading={false}
              onPress={() => {
                navigate(ScreenName.Cadastro_Locais as never);
              }}
            />

            <Listagem
              loading={loading}
              list={listagem}
              onEditClick={edit}
              onDeleteClick={deleteItem}
            />
          </Styled>
        </ScrollView>
      </RefreshControl>
    </Styled>
  );
};

export default Index;
