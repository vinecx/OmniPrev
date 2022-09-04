import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Title } from '../../../../shared/components/commons/Text';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

import { TouchableOpacity } from 'react-native';
import { ILocal } from 'shared/@types/model/locais/locais';
import Loader from '../../../../shared/components/loaders/list.loader';
import Menu, { MenuItem } from '../../../../shared/components/Menu';
import { TIP_ACTIONS } from '../../../../shared/enum';

interface IListagemProps {
  list: ILocal[];
  loading: boolean;
  onDeleteClick: (local: ILocal) => void;
  onEditClick: (local: ILocal) => void;
}

const Listagem: React.FC<IListagemProps> = ({
  list,
  onDeleteClick,
  onEditClick,
  loading,
}) => {
  const [openMenu, setOpenMenu] = useState<{
    open: boolean;
    toEdit?: ILocal;
  }>({
    open: false,
  });

  const onEdit = () => {
    if (openMenu.toEdit) {
      onEditClick(openMenu.toEdit);
      setOpenMenu({ open: false, toEdit: undefined });
    }
  };

  const onDelete = () => {
    if (openMenu.toEdit) {
      onDeleteClick(openMenu.toEdit);
      setOpenMenu({ open: false, toEdit: undefined });
    }
  };

  const data = [
    { label: 'Editar', value: TIP_ACTIONS.UPDATE, action: onEdit },
    { label: 'Excluir', value: TIP_ACTIONS.DELETE, action: onDelete },
  ];

  type Flatten<T> = T extends any[] ? T[number] : T;
  // Extracts out the element type.
  type TypeItems = Flatten<typeof data>;

  if (loading) {
    return <Loader qtdItems={6} />;
  }

  return (
    <Styled marginTop={10} css="flex: 1;">
      <Menu
        show={openMenu.open}
        onDismiss={() => setOpenMenu({ open: false, toEdit: undefined })}
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
              onPress={() => setOpenMenu({ open: true, toEdit: x })}>
              <Styled
                type="row"
                marginTop={10}
                paddingLeft={15}
                paddingRight={15}
                css="border-radius: 20; background-color: white; display: flex; align-items: flex-start; justify-content: space-between;">
                <Styled width="95%">
                  <Text fontSize={16} fontWeight="bold" variance="primary">
                    {x.nome}
                  </Text>
                  <Text fontSize={12} fontWeight="400" variance="secondary">
                    {x.descricao}
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
