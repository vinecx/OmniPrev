import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {} from 'react-native-picker-select';
import { ICliente } from 'shared/@types/model/clientes/clientes';
import { ScreenName } from '../../../routes/screens.enum';
import {
  buscarTodosClientes,
  excluirCliente,
} from '../../../shared/@types/model/clientes/clientes.actions';
import { Button } from '../../../shared/components/commons/Button';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Listagem from './Listagem';

const Index = () => {
  const { navigate } = useNavigation();

  const [listagem, setListagem] = useState<ICliente[]>([]);
  const [loading, setLoading] = useState(false);

  const busca = async () => {
    setLoading(true);
    const { error, errorMessage, data } = await buscarTodosClientes(); // Validações e cadastro

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

  const editCliente = async (cliente: ICliente) => {
    navigate(ScreenName.Cadastro_Clientes as never, cliente as never);
  };

  const deleteCliente = async (cliente: ICliente) => {
    setLoading(true);

    if (cliente.id) {
      const { error, errorMessage } = await excluirCliente(cliente.id); // Validações e cadastro

      if (!error) {
        ToastAndroid.show('Cliente excluído com sucesso!', ToastAndroid.SHORT);
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
                navigate(ScreenName.Cadastro_Clientes as any);
              }}
            />

            <Listagem
              loading={loading}
              list={listagem}
              onEditCliente={editCliente}
              onDeleteCliente={deleteCliente}
            />
          </Styled>
        </ScrollView>
      </RefreshControl>
    </Styled>
  );
};

export default Index;
