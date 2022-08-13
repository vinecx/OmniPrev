import styled from 'styled-components/native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Style from '../../../commons/Style';

export const DrawerContainer = styled.View`
  padding: 10px 15px;
`;

export const DrawerContainerInfo = styled.View`
  padding: 10px;
`;

export const DCSView = styled(DrawerContentScrollView)`
  border-bottom-right-radius: 40px;
  border-top-right-radius: 40px;
  background-color: ${Style.backgroundColorGrey};
`;

export const TextUser = styled.Text`
  font-size: ${Style.fontSizeDefault};
  font-weight: 700;
  color: ${Style.mainColor};
`;

export const TextCompany = styled.Text`
  padding-top: 4px;
  font-size: ${Style.fontSizeSmall};
  color: ${Style.mainColor};
`;

export const TextSecondary = styled.Text`
  font-size: 12;
  color: ${Style.fontColorDarkGrey};
  font-weight: 600;
`;
