import { Platform } from 'react-native';
import { StyledComponent } from 'styled-components';
import styled from 'styled-components/native';
import {
  ICommonPropsStyle,
  PropsStyle,
} from '../../../shared/components/commons/interface';

export const RootComponentStyle = styled.View<
  { styleText: string } & ICommonPropsStyle
>`
  ${props => props.styleText};
  ${props => PropsStyle(props)}
`;

const Collumn = styled(RootComponentStyle)<ICommonPropsStyle>`
  ${props => props.styleText};
  ${props => PropsStyle(props)};
`;

const Container = styled(RootComponentStyle)<ICommonPropsStyle>`
  ${props => PropsStyle(props)}
  ${props => props.styleText};
  padding: 15px;
`;

export const KeyboardView = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
  keyboardVerticalOffset: Platform.OS === 'ios' ? 40 : 0,
})<ICommonPropsStyle>`
  ${props => PropsStyle(props)}
`;

const Row = styled(RootComponentStyle)<ICommonPropsStyle>`
  flex-direction: row;
  padding: 12px 0px;

  ${props => props.styleText};
  ${props => PropsStyle(props)}
`;

export type TypesNames = 'row' | 'container' | 'col' | 'none';
interface PropsTypes {
  component: StyledComponent<any, any, object, string | number | symbol>;
}
export const Types: Record<TypesNames, PropsTypes> = {
  row: { component: Row },
  col: { component: Collumn },
  container: { component: Container },
  none: { component: RootComponentStyle },
};
