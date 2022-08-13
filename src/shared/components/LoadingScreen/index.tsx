import React from 'react';
import { ActivityIndicator, Image } from 'react-native';
import Style from '../../../commons/Style';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import RenderIf from '../../../shared/utils/RenderIf';
import { Container, Title } from './styles';

interface LoadingProps {
  title?: string;
  color?: string;
  logo?: any;
  logoSize: number;
}

const LoadingScreen = (props: LoadingProps) => {
  const { title, color, logo, logoSize } = props;

  return (
    <Container color={color}>
      <Styled
        type="container"
        sm="flex-direction: column;"
        lg="flex-direction: row;">
        <Styled sm="" lg="width: 20%;">
          <RenderIf condition={!!logo}>
            <Styled
              type="container"
              sm="align-self: center;"
              lg="align-content: flex-end; margin-right: 10px;">
              <Image
                source={logo}
                resizeMode="contain"
                style={{ height: logoSize }}
              />
            </Styled>
          </RenderIf>
        </Styled>
        <Styled sm="" lg="width: 20%; justify-content: center;">
          <RenderIf condition={!!title}>
            <Title styleText="font-size: 20px; justify-content: center;">
              {title}
            </Title>
          </RenderIf>
        </Styled>
      </Styled>
      <ActivityIndicator size="large" color={Style.cleanColor} />
    </Container>
  );
};

export default LoadingScreen;
