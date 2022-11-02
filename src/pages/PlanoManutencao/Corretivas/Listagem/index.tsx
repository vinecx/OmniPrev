import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, Title } from '../../../../shared/components/commons/Text';
import { Styled } from '../../../../shared/utils/LayoutUtils/BaseStyle';

import { TouchableOpacity } from 'react-native-gesture-handler';
import Loader from '../../../../shared/components/loaders/list.loader';
import BottomSheet, { MenuItem } from '../../../../shared/components/Menu';
import { TIP_ACTIONS } from '../../../../shared/enum';
import { ICorretiva } from '../../../../shared/@types/model/corretivas/corretivas';
import Style from '../../../../commons/Style';
import { format } from 'date-fns';

interface IListagemProps {
  list: ICorretiva[];
  loading: boolean;
  onDeleteClick: (local: ICorretiva) => void;
  onEditClick: (local: ICorretiva) => void;
}

const Listagem: React.FC<IListagemProps> = ({
  list,
  onDeleteClick,
  onEditClick,
  loading,
}) => {
  const [openMenu, setOpenMenu] = useState<{
    open: boolean;
    toEdit?: ICorretiva;
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

  const hasItems = list.length > 0;

  if (!hasItems) {
    return (
      <Styled type="container" justifyContent="center" alignItems="center">
        <Text textColor={Style.theme.secondary[60]} alignText="center">
          Sem itens...
        </Text>
      </Styled>
    );
  }

  return (
    <Styled marginTop={10} css="flex: 1;">
      <BottomSheet
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
              key={x.id}
              onPress={() => setOpenMenu({ open: true, toEdit: x })}>
              <Styled
                type="row"
                marginTop={10}
                paddingLeft={15}
                paddingRight={15}
                css="border-radius: 20; background-color: white; display: flex; align-items: flex-start; justify-content: space-between;">
                <Styled width="95%">
                  <Text fontSize={16} fontWeight="bold" variance="primary">
                    {x.data
                      ? format(new Date(x.data), 'dd/MM/yyyy')
                      : 'Não informado'}
                  </Text>
                  <Text fontSize={12} fontWeight="400" variance="secondary">
                    {x.localDesc}
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
