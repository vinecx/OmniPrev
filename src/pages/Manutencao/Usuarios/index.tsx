import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IUsuario } from 'shared/@types/model/usuario/usuario';
import { ScreenName } from '../../../routes/screens.enum';
import {
  buscarTodos,
  excluir,
} from '../../../shared/@types/model/usuario/usuario.actions';
import { Button } from '../../../shared/components/commons/Button';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Listagem from './Listagem';

const Index = () => {
  const { navigate } = useNavigation();

  const [listagem, setListagem] = useState<IUsuario[]>([]);
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

  const editUsuario = async (usuario: IUsuario) => {
    navigate(ScreenName.Cadastro_Usuarios as never, usuario as never);
  };

  const deleteUsuario = async (usuario: IUsuario) => {
    setLoading(true);

    if (usuario.id) {
      const { error, errorMessage } = await excluir(usuario.id); // Validações e cadastro

      if (!error) {
        ToastAndroid.show('Usuário excluído com sucesso!', ToastAndroid.SHORT);
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
                navigate(ScreenName.Cadastro_Usuarios as never);
              }}
            />

            <Listagem
              loading={loading}
              list={listagem}
              onEdit={editUsuario}
              onDelete={deleteUsuario}
            />
          </Styled>
        </ScrollView>
      </RefreshControl>
    </Styled>
  );
};

export default Index;
