import styled from 'styled-components/native';
import Style from '../../commons/Style';

export const Row = styled.View`
  flex-direction: row;
`;

export const CardContainer = styled.View.attrs({
  elevation: 20,
  shadowColor: 'hsla(0, 0%, 0%, 0.2)',
})`
  margin: auto 0px;
  padding: 40px 30px;
  display: flex;
  justify-content: center;
  background-color: white;
  border-radius: 40;
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'contain',
})<{ height?: number }>`
  align-self: center;
  align-items: flex-end;
  ${({ height }) => (height ? 'height: ' + height : '')}
`;

export const Label = styled.Text`
  font-weight: 700;
  color: ${Style.fontColorDarkGrey};
`;

export const IconButton = styled.TouchableOpacity`
  position: absolute;
  align-self: flex-end;
`;
