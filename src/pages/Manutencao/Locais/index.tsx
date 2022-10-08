import { useNavigation } from '@react-navigation/native';
import Style from '../../../commons/Style';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScreenName } from '../../../routes/screens.enum';
import { ILocal } from '../../../shared/@types/model/locais/locais';
import LocaisActions from '../../../shared/@types/model/locais/locais.actions';
import { Button } from '../../../shared/components/commons/Button';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Listagem from './Listagem';
import Input from '../../../shared/components/Input';
import { FAB } from 'react-native-paper';

const Index = () => {
  const { navigate } = useNavigation();

  const locaisActions = new LocaisActions();

  const [filter, setFilter] = useState('');

  const [listagem, setListagem] = useState<ILocal[]>([]);
  const [loading, setLoading] = useState(false);

  const listagemFiltered = listagem.filter(
    x =>
      x.nome.toLowerCase().includes(filter.toLowerCase()) ||
      x.descricao.toLowerCase().includes(filter.toLowerCase()),
  );

  const busca = async () => {
    setLoading(true);
    const { error, errorMessage, data } = await locaisActions.buscarTodos(); // Validações e cadastro

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
      const { error, errorMessage } = await locaisActions.excluir(local.id); // Validações e cadastro

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
              onEditClick={edit}
              onDeleteClick={deleteItem}
            />
          </Styled>
        </ScrollView>
      </RefreshControl>

      <Styled css="position: absolute; margin: 30px; bottom: 0; right: 0;">
        <FAB
          icon={'plus'}
          onPress={() => {
            navigate(ScreenName.Cadastro_Locais as never);
          }}
        />
      </Styled>
    </Styled>
  );
};

export default Index;
