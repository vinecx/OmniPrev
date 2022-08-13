import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, VirtualizedList } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Style from '../../../../commons/Style';
import {
  Item,
  TitleItem,
  Title,
  Container,
  Input,
  InputContainer,
  InputLabel,
  Header,
  Row,
  Subtitle,
  LoadingContainer,
  TitleLoading,
  LoadingIndicator,
} from './styles';

export interface IList {
  value: string;
  key: any;
}

interface IListProps {
  options: IList[];
  value?: any;
  onClickItem: (item: IList, refList: string) => void;
  onClickClose: any;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  props?: any;
  refList?: any;
}

interface IListSearch extends IList {
  filtered: boolean;
}

const List: React.FC<IListProps> = ({
  options,
  value,
  onClickItem,
  title,
  subtitle,
  refList,
  onClickClose,
  loading,
}) => {
  const [list, setList] = useState<IListSearch[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setSearchTerm('');
    const listSearch = Object.assign(options) as IListSearch[];
    setList(listSearch.filter(x => (x.filtered = true)));
  }, [options]);

  // Filtro
  useEffect(() => {
    if (searchTerm) {
      setList(
        list.filter(x => {
          if (x.value.toLowerCase().includes(searchTerm.toLowerCase())) {
            x.filtered = true;
          } else {
            x.filtered = false;
          }

          return x;
        }),
      );
    }
  }, [searchTerm]);

  const Loading = () => (
    <LoadingContainer>
      <LoadingIndicator />
      <TitleLoading>Carregando</TitleLoading>
    </LoadingContainer>
  );
  return (
    <Container>
      <Row>
        <Header>
          <Title>{title || 'Sem título'}</Title>
        </Header>
        <TouchableOpacity onPress={() => onClickClose()}>
          <Icon name="close" size={35} color={Style.mainColor} />
        </TouchableOpacity>
      </Row>
      <Row>
        <Subtitle>{subtitle || 'Clique em 1 item para prosseguir'}</Subtitle>
      </Row>
      <InputContainer>
        <InputLabel>Pesquisa</InputLabel>
        <Input
          placeholder={`Pesquisando por: ${title}`}
          value={searchTerm}
          onChangeText={(valueP: string) => {
            setSearchTerm(valueP);
          }}
        />
      </InputContainer>
      {loading ? (
        <Loading />
      ) : (
        <VirtualizedList
          style={styles.list}
          data={list.filter(x => x.filtered)}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          renderItem={({ item }: any) => (
            <Item
              key={item.key}
              onPress={() => onClickItem(item as IList, refList)}>
              <TitleItem selected={item.key === (value || 0)}>
                {item.value}
              </TitleItem>
            </Item>
          )}
          getItemCount={() => list.filter(x => x.filtered).length}
          getItem={(data, index) => data[index] as IListSearch}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
    marginVertical: 20,
  },
});

export default List;
