import styled from 'styled-components/native';
import Style from '../../commons/Style';

export const Row = styled.View`
  flex-direction: row;
`;

export const CardContainer = styled.View.attrs({
  elevation: 15,
  shadowColor: 'hsla(0, 0%, 0%, 0.2)',
})`
  margin: auto 20px;
  padding: 45px 20px;
  justify-content: center;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 35;
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
