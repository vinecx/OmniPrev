import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Styled } from '../../utils/LayoutUtils/BaseStyle';
import { range } from '../../../commons/commons';

interface IListLoader {
  qtdItems: number;
}

const ListLoader: React.FC<IListLoader> = ({ qtdItems }) => {
  return (
    <>
      {range(qtdItems).map(() => (
        <Styled marginBottom={10} marginTop={10}>
          <ContentLoader
            height={80}
            backgroundColor={'#E2E2E2'}
            foregroundColor={'#EFEFEF'}
            interval={0}>
            <Rect x="0" y="0" rx="4" ry="4" width="100%" height="200" />

            <Rect x="10 " y="15" rx="4" ry="4" width="70%" height="25" />
            <Rect x="10" y="45" rx="4" ry="4" width="25%" height="18" />
          </ContentLoader>
        </Styled>
      ))}
    </>
  );
};

export default ListLoader;
