import styled from 'styled-components/native';
import Style from '../../../../commons/Style';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px;
`;

export const ListContainer = styled.ScrollView`
  width: 100%;
  flex-direction: column;
  margin-top: 30px;
`;
export const Item = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 10px;
  border-radius: 10;
  margin-bottom: 10px;
`;
export const TitleItem = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  border-radius: 15px;
  font-weight: bold;
  color: ${Style.mainColor};
`;

// Input Pesquisa

export const InputContainer = styled.View`
  margin-top: 25px;
  width: 100%;
  flex-direction: column;
`;
export const Input = styled.TextInput`
  border: 2px solid ${Style.mainColor};
  border-radius: 15;
  padding: 10px 10px;
`;

export const InputLabel = styled.Text`
  font-size: 12px;
  margin-left: 5px;
  margin-bottom: 5px;
  font-weight: bold;
  color: ${Style.mainColor};
  font-family: ${Style.fontFamilyMulish};
`;

// Title e Subtitle

export const Row = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Header = styled.View`
  flex-direction: column;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${Style.fontColorDarkGrey};
`;

export const Subtitle = styled.Text`
  font-size: 12px;
  color: ${Style.fontColorDarkGrey};
`;

// Loading

export const LoadingContainer = styled.View`
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const TitleLoading = styled.Text`
  font-size: 18px;
  font-weight: 300;
  color: ${Style.fontColorDarkGrey};
`;

export const LoadingIndicator = styled.ActivityIndicator.attrs({
  size: 'large',
  color: Style.fontColorDarkGrey,
})``;
