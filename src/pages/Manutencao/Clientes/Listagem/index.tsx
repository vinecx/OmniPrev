import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Title } from '../../../../shared/components/commons/Text';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

import { TouchableOpacity, View } from 'react-native';
import { ICliente } from 'shared/@types/model/clientes/clientes';
import Style from '../../../../commons/Style';
import Menu, { MenuItem } from '../../../../shared/components/Menu';
import { TIP_ACTIONS } from '../../../../shared/enum';

import Loader from '../../../../shared/components/loaders/list.loader';

interface IListagemProps {
  list: ICliente[];
  loading: boolean;
  onDeleteCliente: (cliente: ICliente) => void;
  onEditCliente: (cliente: ICliente) => void;
}

const Listagem: React.FC<IListagemProps> = ({
  list,
  onEditCliente,
  onDeleteCliente,
  loading,
}) => {
  const [openClienteMenu, setOpenClienteMenu] = useState<{
    open: boolean;
    clienteToEdit?: ICliente;
  }>({
    open: false,
  });

  const onEditClick = () => {
    if (openClienteMenu.clienteToEdit) {
      onEditCliente(openClienteMenu.clienteToEdit);
      setOpenClienteMenu({ open: false, clienteToEdit: undefined });
    }
  };

  const onDeleteClick = () => {
    if (openClienteMenu.clienteToEdit) {
      onDeleteCliente(openClienteMenu.clienteToEdit);
      setOpenClienteMenu({ open: false, clienteToEdit: undefined });
    }
  };

  //#region Listagem menu e suas funções

  const data = [
    { label: 'Editar', value: TIP_ACTIONS.UPDATE, action: onEditClick },
    { label: 'Excluir', value: TIP_ACTIONS.DELETE, action: onDeleteClick },
  ];

  type Flatten<T> = T extends any[] ? T[number] : T;
  // Extracts out the element type.
  type TypeItems = Flatten<typeof data>;

  //#endregion

  if (loading) {
    return <Loader qtdItems={6} />;
  }

  return (
    <Styled marginTop={10} css="flex: 1;">
      <Menu
        show={openClienteMenu.open}
        onDismiss={() =>
          setOpenClienteMenu({ open: false, clienteToEdit: undefined })
        }
        data={data}
        renderItem={(item: TypeItems) => (
          <MenuItem onClick={item.action}>
            <View
              style={{
                height: 40,
                display: 'flex',
                paddingHorizontal: 12,
                justifyContent: 'center',
              }}>
              <Title fontSize={20} variance="primary">
                {item.label}
              </Title>
            </View>
          </MenuItem>
        )}
      />

      <ScrollView keyboardDismissMode="on-drag">
        <Styled css="width: 100%; flex: 1;">
          {list.map(x => (
            <TouchableOpacity
              onPress={() =>
                setOpenClienteMenu({ open: true, clienteToEdit: x })
              }>
              <Styled
                type="row"
                marginTop={10}
                paddingLeft={15}
                paddingRight={15}
                css="border-radius: 20; background-color: white; display: flex; align-items: flex-start; justify-content: space-between;">
                <Styled width="75%">
                  <Text fontSize={16} fontWeight="bold" variance="primary">
                    {x.nomeFantasia}
                  </Text>
                  <Text fontSize={12} fontWeight="400" variance="secondary">
                    {x.CNPJ}
                  </Text>

                  <Text
                    fontSize={12}
                    fontWeight="bold"
                    textColor="grey"
                    marginTop={10}>
                    Endereço:
                  </Text>
                  <Text fontSize={12} fontWeight="400" variance="secondary">
                    {x.endereco.rua}, {x.endereco.bairro}, {x.endereco.numero},
                    - {x.endereco.cidade}
                  </Text>
                </Styled>

                <Styled
                  css="border-radius: 100px; padding: 3px 10px;"
                  backgroundColor={Style.theme.secondary}
                  marginLeft={15}>
                  <Text fontSize={10} fontWeight="bold" textColor="white">
                    {x.ativo ? 'Ativado' : 'Desativado'}
                  </Text>
                </Styled>
              </Styled>
            </TouchableOpacity>
          ))}
        </Styled>
      </ScrollView>
    </Styled>
  );
};

export default Listagem;
