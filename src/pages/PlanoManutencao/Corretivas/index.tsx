import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns/esm';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import Style from '../../../commons/Style';
import { ScreenName } from '../../../routes/screens.enum';
import { ICorretiva } from '../../../shared/@types/model/corretivas/corretivas';
import CorretivasActions from '../../../shared/@types/model/corretivas/corretivas.actions';
import Input from '../../../shared/components/Input';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Listagem from './Listagem';

const Index = () => {
  const { navigate } = useNavigation();

  const [filter, setFilter] = useState('');
  const corretivasActions = new CorretivasActions();

  const [listagem, setListagem] = useState<ICorretiva[]>([]);
  const [loading, setLoading] = useState(false);

  const listagemFiltered = listagem.filter(
    x =>
      (x.data &&
        format(new Date(x.data), 'dd/MM/yyyy').includes(
          filter.toLowerCase(),
        )) ||
      x.localDesc?.toLowerCase().includes(filter.toLowerCase()),
  );

  const busca = async () => {
    setLoading(true);
    try {
      const { errorMessage, data } = await corretivasActions.buscarTodos(); // Validações e cadastro

      if (data) {
        setListagem(data);
      } else {
        ToastAndroid.show(
          String(errorMessage || 'Houve um erro na solicitação'),
          ToastAndroid.SHORT,
        );
      }
    } catch (exception) {}
    setLoading(false);
  };

  useEffect(() => {
    busca();
  }, []);

  const edit = async (item: ICorretiva) => {
    navigate(ScreenName.Cadastro_Corretivas as never, item as never);
  };

  const deleteItem = async (item: ICorretiva) => {
    try {
      setLoading(true);

      if (item.id) {
        const { error, errorMessage } = await corretivasActions.excluir(item); // Validações e cadastro

        if (!error) {
          ToastAndroid.show(
            'Corretiva excluída com sucesso!',
            ToastAndroid.SHORT,
          );
          busca();
        } else {
          ToastAndroid.show(
            String(errorMessage || 'Houve um erro na solicitação'),
            ToastAndroid.SHORT,
          );
        }
      }
    } finally {
      setLoading(false);
    }
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
            navigate(ScreenName.Cadastro_Corretivas as never);
          }}
        />
      </Styled>
    </Styled>
  );
};

export default Index;
