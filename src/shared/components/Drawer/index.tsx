import React, { useEffect, useRef } from 'react';
import { DrawerLayoutAndroid } from 'react-native';
import { Portal, Modal } from 'react-native-paper';

import List, { IList } from './List/index';

export enum Position {
  left = 'left',
  right = 'right',
}

interface IModalList {
  position?: string;
  title: string;
  subtitle?: string;
  children: any;
  options: IList[];
  onClickItem: (item: IList, ref?: any) => void;
  open: boolean;
  onClose: any;
  loading?: boolean;
  refList?: any;
  value?: any;
}
export const ModalList: React.FC<IModalList> = ({
  title,
  subtitle,
  open,
  onClose,
  options,
  value,
  onClickItem,
  loading,
  refList,
}) => {
  if (!open) return null;
  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        contentContainerStyle={{
          flex: 1,
          width: '90%',
          borderRadius: 35,
          backgroundColor: 'white',
          padding: 15,
          marginBottom: 50,
        }}>
        <List
          value={value}
          refList={refList}
          title={title}
          subtitle={subtitle}
          loading={loading || false}
          options={options}
          onClickClose={onClose}
          onClickItem={(item, reflist) => onClickItem(item, reflist)}
        />
      </Modal>
    </Portal>
  );
};

export default ModalList;
