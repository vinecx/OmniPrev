import { VarianceColors, VarianceColorsType } from './../config.colors';
import { ICommonPropsStyle, PropsStyle } from '../interface';
import styled from 'styled-components/native';
import Style from '../../../../commons/Style';
import { VarianceSizesType } from '../config.sizes';
import { VariancesTextSizes } from './config';

export interface IPropsTextStyle extends ICommonPropsStyle {
  size?: VarianceSizesType;
  variance?: VarianceColorsType;
}

export const Text = styled.Text<IPropsTextStyle>`
  ${props => PropsStyle(props)}
  ${props => (props.size ? VariancesTextSizes(props.size) : '')}
  ${props => (props.variance ? 'color: ' + VarianceColors(props.variance) : '')}
`;

export const Title = styled.Text<IPropsTextStyle>`
  font-size: 35;
  font-weight: bold;
  ${props => PropsStyle(props)}
  ${props => (props.size ? VariancesTextSizes(props.size) : '')}
  ${props => (props.variance ? 'color: ' + VarianceColors(props.variance) : '')}
`;

export const Subtitle = styled.Text<IPropsTextStyle>`
  font-size: 24;
  font-weight: bold;
  ${props => PropsStyle(props)}
  ${props => (props.size ? VariancesTextSizes(props.size) : '')}
  ${props => (props.variance ? 'color: ' + VarianceColors(props.variance) : '')}
`;

export const Paragraph = styled.Text<IPropsTextStyle>`
  font-size: 18;
  ${props => PropsStyle(props)}
  ${props => (props.size ? VariancesTextSizes(props.size) : '')}
  ${props => (props.variance ? 'color: ' + VarianceColors(props.variance) : '')}
`;

export const TextError = styled.Text<IPropsTextStyle>`
  color: ${Style.textError};
  font-size: 14;
  ${props => PropsStyle(props)}
  ${props => (props.size ? VariancesTextSizes(props.size) : '')}
`;
