import styled from 'styled-components/native';
import Style from '../../../commons/Style';

export const Container = styled.View`
  padding: 30px 25px 0px 25px;
`;

export const Row = styled.View`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

export const Title = styled.Text`
  width: 85%;
  font-size: 26;
  font-weight: 400;
  color: ${Style.mainColor};
`;
