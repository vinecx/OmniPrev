import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Style from '../../../commons/Style';

import { FAB } from 'react-native-paper';
import { ICliente } from 'shared/@types/model/clientes/clientes';
import { ScreenName } from '../../../routes/screens.enum';
import ClientesActions from '../../../shared/@types/model/clientes/clientes.actions';
import Input from '../../../shared/components/Input';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Listagem from './Listagem';

const Index = () => {
  const { navigate } = useNavigation();
  const [filter, setFilter] = useState('');

  const clientesActions = new ClientesActions();

  const [listagem, setListagem] = useState<ICliente[]>([]);
  const [loading, setLoading] = useState(false);

  const listagemFiltered = listagem.filter(
    x =>
      x.nomeFantasia.toLowerCase().includes(filter.toLowerCase()) ||
      x.razaoSocial.toLowerCase().includes(filter.toLowerCase()) ||
      x.CNPJ.toLowerCase().includes(filter.toLowerCase()) ||
      x.telefone.toLowerCase().includes(filter.toLowerCase()),
  );

  const busca = async () => {
    setLoading(true);
    const { error, errorMessage, data } =
      await clientesActions.buscarTodosClientes(); // Validações e cadastro

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
      const { error, errorMessage } = await clientesActions.excluirCliente(
        cliente.id,
      ); // Validações e cadastro

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
    <Styled
      type="container"
      lg="display: flex;"
      css="flex: 1;"
      backgroundColor={Style.backgroundColorGrey}
      borderTopRadius={30}>
      <RefreshControl
        style={{ flex: 1 }}
        refreshing={loading}
        onRefresh={busca}>
        <ScrollView keyboardDismissMode="on-drag">
          <Input
            value={filter}
            placeholder="Buscar por..."
            onChangeText={value => setFilter(value)}
            marginBottom={10}
            inputStyle={{
              backgroundColor: 'white',
              paddingVertical: 8,
            }}
          />
          <Styled
            sm="width: 100%; flex: 1;"
            lg="width: 90%;"
            css="align-self: center;">
            <Listagem
              loading={loading}
              list={listagemFiltered}
              onEditCliente={editCliente}
              onDeleteCliente={deleteCliente}
            />
          </Styled>
        </ScrollView>
      </RefreshControl>

      <Styled css="position: absolute; bottom:0; right: 0; margin: 25px;">
        <FAB
          icon={'plus'}
          onPress={() => {
            navigate(ScreenName.Cadastro_Clientes as never);
          }}
        />
      </Styled>
    </Styled>
  );
};

export default Index;
