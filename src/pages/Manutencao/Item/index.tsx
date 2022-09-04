import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScreenName } from '../../../routes/screens.enum';
import { IItem } from '../../../shared/@types/model/item/item';
import {
  buscarPorCodigo,
  buscarTodos,
  excluir,
} from '../../../shared/@types/model/item/item.actions';
import { Button } from '../../../shared/components/commons/Button';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Listagem from './Listagem';

const Index = () => {
  const { navigate } = useNavigation();

  const [listagem, setListagem] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
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
    buscar();
  }, []);

  const editItem = async (codItem: string) => {
    const { data, error, errorMessage } = await buscarPorCodigo(codItem);

    if (error) {
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    } else {
      navigate(ScreenName.Cadastro_Items as never, data as never);
    }
  };

  const deleteItem = async (codItem: string) => {
    setLoading(true);

    if (codItem) {
      const { error, errorMessage } = await excluir(codItem); // Validações e cadastro

      if (!error) {
        ToastAndroid.show('Item excluído com sucesso!', ToastAndroid.SHORT);
        buscar();
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
        onRefresh={buscar}>
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
                navigate(ScreenName.Cadastro_Items as never);
              }}
            />

            <Listagem
              loading={loading}
              list={listagem}
              onEdit={editItem}
              onDelete={deleteItem}
            />
          </Styled>
        </ScrollView>
      </RefreshControl>
    </Styled>
  );
};

export default Index;
