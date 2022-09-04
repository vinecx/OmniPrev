import { VarianceColors } from './../config.colors';
import styled from 'styled-components/native';
import { VarianceColorsType } from '../config.colors';
import { ICommonPropsStyle, PropsStyle } from '../interface';
import { VariancesSizes } from './config';
import { VarianceSizesType } from '../config.sizes';

export interface IPropsButtonStyle extends ICommonPropsStyle {
  variance: VarianceColorsType;
  size: VarianceSizesType;
}

export const ButtonStyle = styled.TouchableOpacity<IPropsButtonStyle>`
background-color: ${props => VarianceColors(props.variance)};
${props => VariancesSizes(props.size)}}
border-radius: 100;
${props => PropsStyle(props)}
`;

export const ButtonOutlineStyle = styled.TouchableOpacity<IPropsButtonStyle>`
  ${props => PropsStyle(props)}
  ${props => VariancesSizes(props.size)}}
  border: 1px solid ${props => VarianceColors(props.variance)};
  border-radius: 100;
  padding: 0px 20px;
`;

export const ButtonTextStyle = styled.TouchableOpacity<IPropsButtonStyle>`
  ${props => PropsStyle(props)}
  ${props => VariancesSizes(props.size)}}
`;
