import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../commons/Dimensions';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;
export const Row = styled.View`
  width: ${widthPercentageToDP('80%')};
  padding-top: ${heightPercentageToDP('2%')};
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'contain',
})`
  height: 25px;
  width: 25px;
`;

export const IconMenu = styled(Icon)`
  padding-left: 10px;
`;
