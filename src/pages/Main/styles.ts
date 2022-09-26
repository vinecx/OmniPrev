import { Styled } from '../../shared/utils/LayoutUtils/BaseStyle';
import styled from 'styled-components/native';
import Style from '../../commons/Style';

export const CardContainer = styled(Styled)`
  background-color: white;
  elevation: 2;
  border-radius: 18;
  padding: 0px 20px;
  flex: 1;
  margin: 5px 5px;
`;

export const CardIcon = styled.View``;

export const CardTitle = styled.Text`
  color: ${Style.theme.secondary[50]};
  font-weight: 700;
  font-size: 14px;
  margin: 0px 15px;
`;
