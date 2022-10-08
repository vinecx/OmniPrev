import React, { useEffect, useState } from 'react';
import { Keyboard, ToastAndroid } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import { ICliente } from '../../shared/@types/model/clientes/clientes';
import ClienteActions from '../../shared/@types/model/clientes/clientes.actions';
import { Subtitle, Text, Title } from '../../shared/components/commons/Text';
import { Styled } from '../../shared/utils/LayoutUtils/BaseStyle';
import { IAppDispatch } from '../../store/index';

import { SafeAreaView } from 'react-native-safe-area-context';
import Style from '../../commons/Style';
import Input from '../../shared/components/Input';
import { selectClient } from '../../store/modules/auth/authSlice';

export const StackProps = {
  headerTitle: '',
  headerTransparent: true,
};

const Index = () => {
  const dispatch = useDispatch<IAppDispatch>();
  const [loading, setLoading] = useState(false);
  const [openModalSetClient, setOpenModalSetClient] = useState(false);
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const clientesActions = new ClienteActions();

  const busca = async () => {
    setLoading(true);
    const { error, errorMessage, data } =
      await clientesActions.buscarTodosClientes(); // Validações e cadastro

    if (!error) {
      setClientes(data);
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

  const clientsFiltered = clientes.filter(
    x =>
      x.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
      x.CNPJ.includes(search.toLowerCase()) ||
      x.razaoSocial.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={{ flex: 1 }} onTouchStart={() => Keyboard.dismiss()}>
      <Styled lg="display: flex;" flex={1}>
        <Styled type="container" flex={1} sm={''} lg={''} css="padding: 25px;">
          <Text
            fontSize={35}
            variance="primary"
            fontFamily="Poppins Regular"
            marginBottom={35}>
            Selecione o cliente para prosseguir
          </Text>

          <Input
            value={search}
            onChangeText={value => setSearch(value)}
            placeholder="Buscar por..."
          />

          <ScrollView
            style={{
              flex: 1,
              marginTop: 15,
            }}>
            {clientsFiltered.map(client => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(selectClient(client));
                }}>
                <Styled
                  type="row"
                  css="padding: 10px;"
                  borderRadius="25px"
                  marginBottom={15}>
                  <Styled>
                    <Title
                      fontSize={20}
                      variance="darkenPrimary"
                      fontFamily="Poppins Medium">
                      {client.nomeFantasia}
                    </Title>
                    <Subtitle fontSize={15} fontFamily="Poppins Light">
                      {client.CNPJ}
                    </Subtitle>
                  </Styled>
                  <Styled
                    flex={1}
                    justifyContent="center"
                    alignItems="flex-end">
                    <Icon
                      size={30}
                      name="caretright"
                      color={Style.theme.darkenSecondary}
                    />
                  </Styled>
                </Styled>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Styled>
      </Styled>
    </SafeAreaView>
  );
};

export default Index;
