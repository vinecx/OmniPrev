import styled from 'styled-components/native';
import Style from '../../../../commons/Style';
import { widthPercentageToDP } from '../../../../commons/Dimensions';

export const Button = styled.TouchableOpacity`
  width: ${widthPercentageToDP('38.12%')};
  height: 20%;
  flex-direction: row;
  padding: 0 2%;
  border-radius: 10px;
  margin: 12px 0;
  margin-left: ${widthPercentageToDP('0.9%')};
  margin-right: ${widthPercentageToDP('0.9%')};
  border: 2px solid ${Style.mainColor};
  align-items: center;
`;
export const Title = styled.Text`
  font-size: ${widthPercentageToDP('2%')};
  margin-left: 14px;
  color: ${Style.mainColor};
  font-weight: 400;
  font-family: ${Style.fontFamilyMulish};
`;
export const Logo = styled.Image.attrs({
  resizeMode: 'contain',
})`
  height: 55px;
`;
