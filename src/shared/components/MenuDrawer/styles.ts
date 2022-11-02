import Style from '../../../commons/Style';
import styled from 'styled-components/native';

export const DrawerItem = styled.TouchableOpacity<{ active: boolean }>`
  padding: 15px 20px;
  background-color: ${props =>
    props.active ? Style.theme.mainColor : Style.cleanColor};
  margin: 5px 10px;
  border-radius: 30;
`;
