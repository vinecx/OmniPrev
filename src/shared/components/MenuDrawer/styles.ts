import Style from '../../../commons/Style';
import styled from 'styled-components/native';

export const DrawerItem = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px 26px;
  background-color: ${props =>
    props.active ? Style.theme.primary : Style.theme.lighterSecondary};
  margin: 0px 15px 10px 0px;
  border-top-right-radius: 30;
  border-bottom-right-radius: 30;
`;
