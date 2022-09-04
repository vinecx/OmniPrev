import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Title } from '../../../../shared/components/commons/Text';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

import { TouchableOpacity } from 'react-native';
import { IUsuario } from 'shared/@types/model/usuario/usuario';
import Style from '../../../../commons/Style';
import Menu, { MenuItem } from '../../../../shared/components/Menu';
import {
  TIP_ACTIONS,
  TIP_USUARIOS_DESCRIPTIONS,
} from '../../../../shared/enum';

import Loader from '../../../../shared/components/loaders/list.loader';

interface IListagemProps {
  list: IUsuario[];
  loading: boolean;
  onDelete: (usuario: IUsuario) => void;
  onEdit: (usuario: IUsuario) => void;
}

const Listagem: React.FC<IListagemProps> = ({
  list,
  onEdit,
  onDelete,
  loading,
}) => {
  const [openUsuarioMenu, setOpenUsuarioMenu] = useState<{
    open: boolean;
    usuarioToEdit?: IUsuario;
  }>({
    open: false,
  });

  const onEditClick = () => {
    if (openUsuarioMenu.usuarioToEdit) {
      onEdit(openUsuarioMenu.usuarioToEdit);
      setOpenUsuarioMenu({ open: false, usuarioToEdit: undefined });
    }
  };

  const onDeleteClick = () => {
    if (openUsuarioMenu.usuarioToEdit) {
      onDelete(openUsuarioMenu.usuarioToEdit);
      setOpenUsuarioMenu({ open: false, usuarioToEdit: undefined });
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
        show={openUsuarioMenu.open}
        onDismiss={() =>
          setOpenUsuarioMenu({ open: false, usuarioToEdit: undefined })
        }
        data={data}
        renderItem={(item: TypeItems) => (
          <MenuItem onClick={item.action}>
            <Styled css="padding: 8px 12px;" justifyContent="center">
              <Title fontSize={20} variance="primary">
                {item.label}
              </Title>
            </Styled>
          </MenuItem>
        )}
      />

      <ScrollView keyboardDismissMode="on-drag">
        <Styled css="width: 100%; flex: 1;">
          {list.map(x => (
            <TouchableOpacity
              onPress={() =>
                setOpenUsuarioMenu({ open: true, usuarioToEdit: x })
              }>
              <Styled
                type="row"
                marginTop={10}
                paddingLeft={15}
                paddingRight={15}
                css="border-radius: 20; background-color: white; display: flex; align-items: flex-start; justify-content: space-between;">
                <Styled>
                  <Text fontSize={16} fontWeight="bold" variance="primary">
                    {x.nome}
                  </Text>
                  <Text fontSize={12} fontWeight="400" variance="secondary">
                    {x.cpf}
                  </Text>
                </Styled>

                <Styled
                  css="border-radius: 100px; padding: 3px 10px;"
                  backgroundColor={Style.theme.secondary}
                  marginLeft={15}>
                  <Text fontSize={10} fontWeight="bold" textColor="white">
                    {TIP_USUARIOS_DESCRIPTIONS[x.tipUsuario]}
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
