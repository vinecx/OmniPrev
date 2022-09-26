import styled from 'styled-components/native';
import Style from '../../../commons/Style';

export const Container = styled.View<{
  color?: string;
}>`
  flex: 1;
  background-color: ${props => props.color || Style.mainColor};
  justify-content: center;
  align-items: center;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const Title = styled.Text<{ styleText: string }>`
  ${props => props.styleText};
  color: ${Style.backgroundColorGrey};
  font-weight: bold;
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'cover',
})``;
