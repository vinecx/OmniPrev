import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Title } from '../../../../shared/components/commons/Text';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

import { TouchableOpacity } from 'react-native';
import Style from '../../../../commons/Style';
import { IItem } from '../../../../shared/@types/model/item/item';
import Menu, { MenuItem } from '../../../../shared/components/Menu';
import { TIP_ACTIONS } from '../../../../shared/enum';

import Loader from '../../../../shared/components/loaders/list.loader';
import RenderIf from '../../../../shared/utils/RenderIf';

interface IListagemProps {
  list: IItem[];
  loading: boolean;
  onDelete: (codItem: string) => void;
  onEdit: (item: string) => void;
}

const Listagem: React.FC<IListagemProps> = ({
  list,
  loading,
  onEdit,
  onDelete,
}) => {
  const [openMenu, setOpenMenu] = useState<{
    open: boolean;
    itemToEdit?: IItem;
  }>({
    open: false,
  });

  const onEditClick = () => {
    if (openMenu.itemToEdit?.id) {
      onEdit(openMenu.itemToEdit.id);
      setOpenMenu({ open: false, itemToEdit: undefined });
    }
  };

  const onDeleteClick = () => {
    if (openMenu.itemToEdit?.id) {
      onDelete(openMenu.itemToEdit.id);
      setOpenMenu({ open: false, itemToEdit: undefined });
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
        show={openMenu.open}
        onDismiss={() => setOpenMenu({ open: false, itemToEdit: undefined })}
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
              onPress={() => setOpenMenu({ open: true, itemToEdit: x })}>
              <Styled
                type="row"
                marginTop={8}
                paddingLeft={15}
                paddingRight={15}
                css="border-radius: 20; background-color: white; display: flex; align-items: flex-start; justify-content: space-between;">
                <Styled>
                  <Text fontSize={16} fontWeight="bold" variance="primary">
                    {x.nome}
                  </Text>
                  <Text fontSize={12} fontWeight="400" variance="secondary">
                    {x.descricao}
                  </Text>
                </Styled>

                <RenderIf condition={!!x.fabricante}>
                  <Styled
                    css="border-radius: 100px; padding: 3px 10px;"
                    backgroundColor={Style.theme.secondary[50]}
                    marginLeft={15}>
                    <Text fontSize={10} fontWeight="bold" textColor="white">
                      {x.fabricante}
                    </Text>
                  </Styled>
                </RenderIf>
              </Styled>
            </TouchableOpacity>
          ))}
        </Styled>
      </ScrollView>
    </Styled>
  );
};

export default Listagem;
